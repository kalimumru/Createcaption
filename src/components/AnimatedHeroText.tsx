import { useState, useEffect } from "react";

const AnimatedHeroText = () => {
  const words = ["Captions", "Hashtags", "Titles"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground">
      Generate Perfect Social Media{" "}
      <span className="relative inline-block h-[1.2em] align-bottom overflow-hidden">
        {words.map((word, index) => (
          <span
            key={word}
            className={`absolute left-0 top-0 w-full transition-all duration-500 ${
              index === currentIndex
                ? "opacity-100 translate-y-0"
                : index === (currentIndex - 1 + words.length) % words.length
                ? "opacity-0 translate-y-full"
                : "opacity-0 -translate-y-full"
            }`}
            style={{
              background: "var(--hero-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {word}
          </span>
        ))}
      </span>
    </h1>
  );
};

export default AnimatedHeroText;
