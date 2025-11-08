import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { platform, fileType, imageData } = await req.json();

    if (!platform || !fileType) {
      return new Response(
        JSON.stringify({ error: 'Platform and file type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check user's credits
    const { data: subscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (subError || !subscription) {
      return new Response(
        JSON.stringify({ error: 'Subscription not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const creditsNeeded = fileType === 'video' ? 5 : 2;
    const availableCredits = subscription.credits_limit - subscription.credits_used;

    if (availableCredits < creditsNeeded) {
      return new Response(
        JSON.stringify({ error: 'Insufficient credits', creditsNeeded, availableCredits }),
        { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Platform-specific prompts
    const platformPrompts = {
      instagram: 'Instagram posts should be visually engaging with lifestyle and aesthetic focus. Include emojis and call-to-action.',
      youtube: 'YouTube content should be informative and engaging with strong titles that encourage clicks. Include timestamps if relevant.',
      tiktok: 'TikTok content should be trendy, fast-paced, and use trending sounds/challenges. Keep it short and punchy.',
      facebook: 'Facebook posts should be community-focused and conversational. Encourage comments and shares.',
      x: 'X (Twitter) posts should be concise, witty, and newsworthy. Keep under 280 characters for the main caption.'
    };

    const systemPrompt = `You are a professional social media content creator specializing in ${platform}. 
${platformPrompts[platform as keyof typeof platformPrompts] || platformPrompts.instagram}

Generate content in this exact JSON format:
{
  "title": "Engaging title that grabs attention",
  "caption": "Compelling caption with emojis and a clear call-to-action (2-3 paragraphs)",
  "hashtags": ["hashtag1", "hashtag2", ...] (exactly 20 trending hashtags relevant to the content and platform)
}

Make sure the content is:
- Authentic and engaging
- Platform-appropriate
- Includes relevant emojis
- Has a clear call-to-action
- Uses trending and relevant hashtags`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Call Lovable AI
    const aiMessages: any[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate ${platform} content for this ${fileType}. Make it engaging and platform-specific.` }
    ];

    // If image data is provided, include it in the request
    if (imageData && fileType === 'image') {
      aiMessages[1] = {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Generate ${platform} content for this image. Make it engaging and platform-specific.`
          },
          {
            type: 'image_url',
            image_url: {
              url: imageData
            }
          }
        ]
      };
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: aiMessages,
        response_format: { type: 'json_object' }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'AI service rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI gateway error: ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const generatedContent = JSON.parse(aiData.choices[0].message.content);

    // Update user's credits
    const { error: updateError } = await supabaseClient
      .from('subscriptions')
      .update({ 
        credits_used: subscription.credits_used + creditsNeeded,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating credits:', updateError);
    }

    return new Response(
      JSON.stringify({
        ...generatedContent,
        creditsUsed: creditsNeeded,
        creditsRemaining: availableCredits - creditsNeeded
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
