import { useState, useCallback } from "react";
import { Upload, Image, Video, Sparkles, Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
const platforms = [{
  id: "instagram",
  name: "Instagram",
  color: "bg-gradient-to-br from-purple-500 to-pink-500"
}, {
  id: "youtube",
  name: "YouTube",
  color: "bg-red-600"
}, {
  id: "tiktok",
  name: "TikTok",
  color: "bg-black"
}, {
  id: "facebook",
  name: "Facebook",
  color: "bg-blue-600"
}, {
  id: "x",
  name: "X",
  color: "bg-gray-900"
}];
const ContentGenerator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const handleFile = useCallback((file: File) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (isImage && file.size > 20 * 1024 * 1024) {
      toast.error("Image size must be less than 20MB");
      return;
    }
    if (isVideo && file.size > 200 * 1024 * 1024) {
      toast.error("Video size must be less than 200MB");
      return;
    }
    if (isImage || isVideo) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFileType(isImage ? "image" : "video");
      setFile(file);
      setGenerated(null);
    }
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);
  const handleGenerate = async () => {
    if (!user) {
      toast.error("Please login to generate content");
      navigate("/auth");
      return;
    }
    if (!file || !selectedPlatform) {
      toast.error("Please upload a file and select a platform");
      return;
    }
    setGenerating(true);
    try {
      // Convert file to base64 if it's an image
      let imageData = null;
      if (fileType === "image") {
        imageData = await new Promise<string>(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }
      const {
        data,
        error
      } = await supabase.functions.invoke("generate-content", {
        body: {
          platform: selectedPlatform,
          fileType,
          imageData
        }
      });
      if (error) throw error;
      setGenerated(data);
      toast.success(`Content generated successfully! ${data.creditsUsed} credits used`);
    } catch (error: any) {
      console.error("Error generating content:", error);
      if (error.message?.includes("Insufficient credits")) {
        toast.error("Insufficient credits. Please upgrade your plan.");
      } else if (error.message?.includes("Unauthorized")) {
        toast.error("Please login to generate content");
        navigate("/auth");
      } else {
        toast.error(error.message || "Failed to generate content");
      }
    } finally {
      setGenerating(false);
    }
  };
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(null), 2000);
  };
  return <div className="space-y-8">
      {/* Upload Section */}
      <Card className={`p-8 border-2 border-dashed transition-all ${isDragging ? "border-primary bg-primary/5" : "border-border"}`} onDragOver={e => {
      e.preventDefault();
      setIsDragging(true);
    }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}>
        {preview ? <div className="space-y-4">
            {fileType === "image" ? <img src={preview} alt="Preview" className="w-full h-64 object-contain rounded-lg" /> : <video src={preview} controls className="w-full h-64 rounded-lg" />}
            <button onClick={() => {
          setPreview(null);
          setFileType(null);
          setFile(null);
          setGenerated(null);
        }} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Remove and upload new file
            </button>
          </div> : <label className="flex flex-col items-center justify-center cursor-pointer py-12">
            <Upload className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold mb-2">Drop your media here or click to upload</p>
            <p className="text-sm text-muted-foreground mb-4">
              Images (.jpg, .png, .webp) up to 20MB or Videos (.mp4, .mov) up to 200MB
            </p>
            <div className="flex gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                <span>Images</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span>Videos</span>
              </div>
            </div>
            <input type="file" className="hidden" accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime" onChange={e => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }} />
          </label>}
      </Card>

      {/* Platform Selector */}
      {preview && <div className="space-y-4">
          <h3 className="text-xl font-semibold">Select Platform</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {platforms.map(platform => <Card key={platform.id} className={`p-4 cursor-pointer transition-all hover:scale-105 ${selectedPlatform === platform.id ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"}`} onClick={() => setSelectedPlatform(platform.id)}>
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center text-white`}>
                    <span className="font-bold text-lg">{platform.name.charAt(0)}</span>
                  </div>
                  <span className="text-sm font-medium text-center">{platform.name}</span>
                </div>
              </Card>)}
          </div>

          <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleGenerate} disabled={!selectedPlatform || generating}>
            {generating ? <>Generating...</> : <>
                <Sparkles className="mr-2" />
                Generate Content ({fileType === "video" ? "5" : "2"} Credits)
              </>}
          </Button>
        </div>}

      {/* Generated Content */}
      {generated && <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Generated Content</h3>
              <span className="text-sm text-muted-foreground">
                {generated.creditsRemaining} credits remaining
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold">Title</label>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(generated.title, "title")}>
                    {copied === "title" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="p-4 bg-background rounded-lg">{generated.title}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold">Caption</label>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(generated.caption, "caption")}>
                    {copied === "caption" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="p-4 bg-background rounded-lg whitespace-pre-wrap">{generated.caption}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold">Hashtags</label>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(generated.hashtags.map((h: string) => `#${h}`).join(" "), "hashtags")}>
                    {copied === "hashtags" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="p-4 bg-background rounded-lg flex flex-wrap gap-2">
                  {generated.hashtags.map((hashtag: string, index: number) => <span key={index} className="text-primary font-bold text-base">
                      #{hashtag}
                    </span>)}
                </div>
              </div>
            </div>
          </div>
        </Card>}
    </div>;
};
export default ContentGenerator;