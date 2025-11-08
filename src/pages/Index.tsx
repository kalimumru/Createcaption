import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AnimatedHeroText from "@/components/AnimatedHeroText";
import Navbar from "@/components/Navbar";
import ContentGenerator from "@/components/ContentGenerator";
import PricingCard from "@/components/PricingCard";
import Footer from "@/components/Footer";
import { Sparkles, TrendingUp, Gift } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
const Index = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const handleTryFree = () => {
    if (user) {
      document.getElementById("how-it-works")?.scrollIntoView({
        behavior: "smooth"
      });
    } else {
      navigate("/auth");
    }
  };
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <AnimatedHeroText />
              <p className="text-xl text-muted-foreground max-w-2xl">
                Upload your media, select your platform, and let AI generate engaging titles, captions, 
                hashtags, and explanations that drive engagement.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6" onClick={handleTryFree}>
                  <Sparkles className="mr-2" />
                  Try Free
                </Button>
                
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="relative z-10">
                <img src={heroImage} alt="Social Media Content Creator" className="rounded-2xl shadow-2xl w-full animate-float" />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="how-it-works" className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Create Amazing Content in 3 Steps</h2>
            <p className="text-muted-foreground">Simple, fast, and powerful</p>
          </div>
          
          <div className="space-y-8">
            <ContentGenerator />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground">Flexible pricing for every creator</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            <PricingCard name="Free" price="₹0" credits="20 Credits/Month" features={["Image uploads only", "Basic features", "Ads included", "Community support", "Single platform selection"]} />
            <PricingCard name="Basic" price="₹149" credits="200 Credits/Month" features={["Image & Video uploads", "All features", "Ads included", "Priority support", "Single platform selection", "Advanced AI models"]} popular />
            <PricingCard name="Pro" price="₹499" credits="400 Credits/Month" features={["Image & Video uploads", "All premium features", "Ad-free experience", "Premium support", "Select 2 platforms", "Advanced AI models", "Priority processing"]} />
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Buy Extra Credits</h3>
                  <p className="text-muted-foreground mb-3">Need more? Get 50 credits for just ₹99</p>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    Buy Credits
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Gift className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Referral Bonus</h3>
                  <p className="text-muted-foreground mb-3">Get +10 credits for you and your friend!</p>
                  <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white">
                    Share & Earn
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">About CreateCaption</h2>
          <p className="text-xl text-muted-foreground mb-8">
            We're on a mission to help content creators, influencers, and businesses create 
            engaging social media content effortlessly. Our AI-powered platform generates 
            professional captions, trending hashtags, and compelling titles that drive engagement 
            across all major social media platforms.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Card className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <p className="text-muted-foreground">Active Users</p>
            </Card>
            <Card className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <p className="text-muted-foreground">Content Generated</p>
            </Card>
            <Card className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">5+</div>
              <p className="text-muted-foreground">Platforms Supported</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-muted-foreground">Have questions? We'd love to hear from you.</p>
          </div>
          
          <Card className="p-8">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea rows={5} className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Tell us how we can help..." />
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Index;