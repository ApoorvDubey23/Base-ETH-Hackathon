import React from 'react';
import { Button } from "@/components/ui/button";
import { CirclePlay } from "lucide-react";

const HeroBanner: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl mb-8 h-[400px] md:h-[500px] mx-4 md:mx-6 shadow-2xl">
      {/* Background Gradient with vibrant, gaming-inspired hues */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 dark:from-indigo-800 dark:via-purple-800 dark:to-fuchsia-800" />

      {/* Decorative spinning game orbs */}
      <div className="absolute top-[10%] left-[10%] w-56 h-56 rounded-full bg-white/10 dark:bg-white/5 blur-3xl animate-spin-slow" />
      <div className="absolute bottom-[10%] right-[10%] w-64 h-64 rounded-full bg-white/10 dark:bg-white/5 blur-3xl animate-spin-slow reverse-animation duration-[12s]" />

      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 drop-shadow-lg">
            Welcome to <span className="bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">MetaBet</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-800 dark:text-gray-200 max-w-lg drop-shadow-sm">
            Play our exclusive games including Plinko, Dice, and Mines to win big rewards instantly!
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Button
              size="lg"
              className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white shadow-md"
              onClick={() => scrollToSection("popular-now")}
            >
              <CirclePlay className="h-5 w-5" />
              Play Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border border-white/30 bg-white/10 dark:bg-black/20 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-black/30 text-white shadow-sm"
              onClick={() => scrollToSection("footer")}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative dice images with neon glow effect */}
      <div className="absolute right-[10%] top-[20%] animate-float opacity-80">
        <div className="w-12 h-12 bg-cyan-400 rounded-xl shadow-lg shadow-cyan-400/50" />
      </div>
      <div className="absolute right-[15%] bottom-[20%] animate-float opacity-80 delay-1000">
        <div className="w-16 h-16 bg-purple-400 rounded-xl shadow-lg shadow-purple-400/50 -rotate-12" />
      </div>
    </div>
  );
};

export default HeroBanner;
