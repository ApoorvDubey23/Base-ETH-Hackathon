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
    <div className="relative overflow-hidden rounded-xl mb-8 h-[400px] md:h-[500px] mx-4 md:mx-6">
      <div className="absolute inset-0 bg-gradient-to-br from-light-primary to-light-secondary dark:from-dark-primary dark:to-dark-secondary" />

      {/* Decorative elements */}
      <div className="absolute top-[10%] left-[10%] w-56 h-56 rounded-full bg-light-accent/20 dark:bg-dark-accent/20 blur-3xl animate-spin-slow" />
      <div className="absolute bottom-[10%] right-[10%] w-64 h-64 rounded-full bg-light-accent-secondary/20 dark:bg-dark-accent-secondary/20 blur-3xl animate-spin-slow reverse-animation duration-[12s]" />

      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-light-heading dark:text-dark-heading leading-tight">
            Welcome to <span className="bg-gradient-to-r from-light-accent to-light-accent-secondary dark:from-dark-accent dark:to-dark-accent-secondary bg-clip-text">MetaBet</span>
          </h1>
          <p className="text-lg md:text-xl text-light-subtext dark:text-dark-subtext max-w-lg">
            Play our exclusive games including Limbo, Plinko, Dice, and Mines to win big rewards instantly!
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Button size="lg" className="flex items-center gap-2 bg-light-accent dark:bg-dark-accent hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover text-light-button-text dark:text-dark-button-text" onClick={() => scrollToSection("popular-now")}>
              <CirclePlay className="h-5 w-5" />
              Play Now
            </Button>
            <Button size="lg" variant="outline" className="border-light-border dark:border-dark-border bg-light-bg/5 dark:bg-dark-bg/5 backdrop-blur-sm hover:bg-light-bg/10 dark:hover:bg-dark-bg/10 text-light-button-text dark:text-dark-button-text" onClick={() => scrollToSection("footer")}>
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative dice images */}
      <div className="absolute right-[10%] top-[20%] animate-float opacity-70">
        <div className="w-12 h-12 bg-light-accent dark:bg-dark-accent rounded-xl shadow-lg shadow-light-accent/30 dark:shadow-dark-accent/30 rotate-12" />
      </div>
      <div className="absolute right-[15%] bottom-[20%] animate-float opacity-70 delay-1000">
        <div className="w-16 h-16 bg-light-accent-secondary dark:bg-dark-accent-secondary rounded-xl shadow-lg shadow-light-accent-secondary/30 dark:shadow-dark-accent-secondary/30 -rotate-12" />
      </div>
    </div>
  );
};

export default HeroBanner;
