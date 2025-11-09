import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Coins, TrendingUp, Gift, Clock, Image, Video } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<any>(null);
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      // Fetch subscription
      const { data: subData, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (subError) throw subError;
      setSubscription(subData);

      // Fetch referral code
      const { data: refData, error: refError } = await supabase
        .from("referral_codes")
        .select("code")
        .eq("user_id", user?.id)
        .single();

      if (refError) throw refError;
      setReferralCode(refData.code);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const availableCredits = subscription ? subscription.credits_limit - subscription.credits_used : 0;
  const progressPercentage = subscription ? (availableCredits / subscription.credits_limit) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">Manage your content and credits</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Credits Card */}
            <Card className="p-6 md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Coins className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Available Credits</h3>
                    <p className="text-2xl font-bold text-primary">{availableCredits}</p>
                  </div>
                </div>
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    document.getElementById('credit-packs')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Buy Credits
                </Button>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                {availableCredits} of {subscription?.credits_limit} credits remaining
              </p>
            </Card>

            {/* Plan Card */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Current Plan</h3>
                  <p className="text-xl font-bold capitalize">{subscription?.plan}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => navigate("/#pricing")}>
                Upgrade Plan
              </Button>
            </Card>
          </div>

          {/* Referral Section */}
          <Card className="p-6 mb-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Invite Friends, Earn Credits</h3>
                  <p className="text-muted-foreground">Get +10 credits for each friend who signs up!</p>
                  <div className="flex items-center gap-2 mt-2">
                    <code className="px-3 py-1 bg-background rounded border text-sm">
                      {referralCode}
                    </code>
                    <Button variant="ghost" size="sm" onClick={copyReferralCode}>
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              </div>
               <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap"
                onClick={() => {
                  const shareUrl = `${window.location.origin}/auth?ref=${referralCode}`;
                  if (navigator.share) {
                    navigator.share({
                      title: 'Join CreateCaption',
                      text: `Use my referral code ${referralCode} and get bonus credits!`,
                      url: shareUrl,
                    });
                  } else {
                    navigator.clipboard.writeText(shareUrl);
                    toast.success('Referral link copied to clipboard!');
                  }
                }}
              >
                Share Referral
              </Button>
            </div>
          </Card>

          {/* Usage Guide */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Start Creating Content</h2>
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Ready to generate amazing content?</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload your images or videos, select your platform, and let AI create professional captions, 
                    titles, and hashtags in seconds.
                  </p>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4 text-primary" />
                      <span>2 credits per image</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4 text-primary" />
                      <span>5 credits per video</span>
                    </div>
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => navigate("/")}
                >
                  Start Creating
                </Button>
              </div>
            </Card>
          </div>

          {/* Credit Packs */}
          <div id="credit-packs">
            <h2 className="text-2xl font-bold mb-4">Buy Extra Credits</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { credits: 50, price: "₹99", popular: false },
                { credits: 100, price: "₹179", popular: true },
                { credits: 200, price: "₹299", popular: false },
              ].map((pack) => (
                <Card key={pack.credits} className={`p-6 ${pack.popular ? "border-2 border-primary" : ""}`}>
                  {pack.popular && (
                    <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3">
                      Best Value
                    </div>
                  )}
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold mb-1">{pack.credits}</div>
                    <p className="text-sm text-muted-foreground">Credits</p>
                  </div>
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-primary">{pack.price}</div>
                  </div>
                  <Button 
                    className={`w-full ${pack.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                    variant={pack.popular ? "default" : "outline"}
                    onClick={() => {
                      toast.info('Payment integration coming soon! Razorpay will be integrated shortly.');
                      // TODO: Implement Razorpay payment
                    }}
                  >
                    Purchase
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
