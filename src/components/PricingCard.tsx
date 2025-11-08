import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PricingCardProps {
  name: string;
  price: string;
  credits: string;
  features: string[];
  popular?: boolean;
}

const PricingCard = ({ name, price, credits, features, popular }: PricingCardProps) => {
  return (
    <Card className={`p-8 relative ${popular ? "border-2 border-primary shadow-xl scale-105" : ""}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
          Most Popular
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <div className="text-4xl font-bold mb-2">
          {price}
        </div>
        <p className="text-muted-foreground">{credits}</p>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        className={`w-full ${popular ? "bg-primary hover:bg-primary/90" : ""}`}
        variant={popular ? "default" : "outline"}
      >
        Get Started
      </Button>
    </Card>
  );
};

export default PricingCard;
