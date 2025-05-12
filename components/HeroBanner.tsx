
import React from 'react';
import { Button } from "@/components/ui/button";
import { CirclePlay } from "lucide-react";

const HeroBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-xl mb-8 h-[400px] md:h-[500px] mx-4 md:mx-6">
      <div className="absolute inset-0 bg-gradient-casino" />
      
      {/* Decorative elements */}
      <div className="absolute top-[10%] left-[10%] w-56 h-56 rounded-full bg-casino-purple/20 filter blur-3xl animate-spin-slow" />
      <div className="absolute bottom-[10%] right-[10%] w-64 h-64 rounded-full bg-casino-blue/20 filter blur-3xl animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
      
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Experience the Thrill of <span className="bg-gradient-to-r from-casino-purple to-casino-blue bg-clip-text text-transparent">Online Gaming</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-lg">
            Play our exclusive games including Plinko, Limbo, and Dice to win big rewards instantly!
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Button size="lg" className="game-button flex items-center gap-2">
              <CirclePlay className="h-5 w-5" />
              Play Now
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white">
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative dice images */}
      <div className="absolute right-[10%] top-[20%] animate-float opacity-70">
        <div className="w-12 h-12 bg-casino-purple rounded-xl shadow-lg shadow-purple-500/30 rotate-12" />
      </div>
      <div className="absolute right-[15%] bottom-[20%] animate-float opacity-70" style={{ animationDelay: '1s' }}>
        <div className="w-16 h-16 bg-casino-blue rounded-xl shadow-lg shadow-blue-500/30 -rotate-12" />
      </div>
    </div>
  );
};

export default HeroBanner;
