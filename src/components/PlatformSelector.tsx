import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Instagram, Youtube, Facebook } from "lucide-react";

const platforms = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-gradient-to-br from-purple-500 to-pink-500" },
  { id: "youtube", name: "YouTube", icon: Youtube, color: "bg-red-600" },
  { id: "tiktok", name: "TikTok", icon: null, color: "bg-black" },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600" },
  { id: "x", name: "X (Twitter)", icon: null, color: "bg-gray-900" },
];

const PlatformSelector = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Select Platform</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {platforms.map((platform) => (
          <Card
            key={platform.id}
            className={`p-4 cursor-pointer transition-all hover:scale-105 ${
              selected === platform.id
                ? "ring-2 ring-primary shadow-lg"
                : "hover:shadow-md"
            }`}
            onClick={() => setSelected(platform.id)}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${platform.color} flex items-center justify-center text-white`}>
                {platform.icon ? (
                  <platform.icon className="w-6 h-6" />
                ) : (
                  <span className="font-bold text-lg">
                    {platform.name.charAt(0)}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-center">
                {platform.name}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PlatformSelector;
