
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { CirclePlay } from "lucide-react";

interface GameCardProps {
  title: string;
  description: string;
  imageUrl: string;
  hoverEffect?: boolean;
  link?: string;
}

const GameCard: React.FC<GameCardProps> = ({ 
  title, 
  description, 
  imageUrl, 
  hoverEffect = true,
  link = "#"
}) => {
  return (
    <div className={`casino-card group h-full transition-all duration-300 ${hoverEffect ? 'hover:translate-y-[-8px]' : ''}`}>
      <div className="relative overflow-hidden aspect-[4/3]">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link href={link}>
            <Button size="lg" className="game-button flex items-center gap-2">
              <CirclePlay className="h-5 w-5" />
              Play Now
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-1 text-white">{title}</h3>
        <p className="text-sm text-gray-300">{description}</p>
      </div>
    </div>
  );
};

export default GameCard;
