import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Coins, TrendingUp, Gift, Clock, Image, Video } from "lucide-react";

const Dashboard = () => {
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
                    <p className="text-2xl font-bold text-primary">150</p>
                  </div>
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Buy Credits
                </Button>
              </div>
              <Progress value={75} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">150 of 200 credits remaining</p>
            </Card>

            {/* Plan Card */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Current Plan</h3>
                  <p className="text-xl font-bold">Basic</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
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
                      CREATE2025XYZ
                    </code>
                    <Button variant="ghost" size="sm">Copy</Button>
                  </div>
                </div>
              </div>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap">
                Share Referral
              </Button>
            </div>
          </Card>

          {/* Usage History */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <div className="grid gap-4">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                        {item % 2 === 0 ? (
                          <Video className="w-8 h-8 text-muted-foreground" />
                        ) : (
                          <Image className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold">Instagram Content</h4>
                        <p className="text-sm text-muted-foreground">
                          Generated for Instagram • {item % 2 === 0 ? "5" : "2"} credits used
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>2h ago</span>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Credit Packs */}
          <div>
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
