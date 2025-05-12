
import React from 'react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Dices, CircleArrowRight, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";

const PopularNow: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="casino-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-10 h-10 rounded-full bg-casino-green/20 flex items-center justify-center">
              <Dices className="h-5 w-5 text-casino-green" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Popular Now</h2>
              <p className="text-sm text-gray-400">Hot games players are enjoying right now</p>
            </div>
          </div>
          <Badge variant="outline" className="border-casino-gold bg-black/30 text-casino-gold px-3 py-1">
            TRENDING
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="casino-card border-casino-green/20 bg-black/20">
            <div className="p-6">
              <div className="h-12 w-12 rounded-lg bg-casino-blue/20 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-casino-blue">P</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Plinko</h3>
              <p className="text-gray-400 text-sm mb-4">Our most popular game! Drop the ball and watch it bounce for huge multipliers.</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  <span className="text-casino-green">4,562</span> playing now
                </div>
                <Link href="/plinko">
                  <Button variant="ghost" size="sm" className="text-casino-blue hover:text-casino-blue/80 p-0">
                    Play <CircleArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="casino-card border-casino-gold/20 bg-black/20">
            <div className="p-6">
              <div className="h-12 w-12 rounded-lg bg-casino-gold/20 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-casino-gold">L</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Limbo</h3>
              <p className="text-gray-400 text-sm mb-4">How high will the multiplier climb? Test your luck in this thrilling game.</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  <span className="text-casino-green">3,271</span> playing now
                </div>
                <Button variant="ghost" size="sm" className="text-casino-gold hover:text-casino-gold/80 p-0">
                  Play <CircleArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="casino-card border-casino-purple/20 bg-black/20">
            <div className="p-6">
              <div className="h-12 w-12 rounded-lg bg-casino-purple/20 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-casino-purple">D</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dice</h3>
              <p className="text-gray-400 text-sm mb-4">Classic dice game with a modern twist. Predict your rolls and win big.</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  <span className="text-casino-green">2,809</span> playing now
                </div>
                <Link href="/Dicegame">
                  <Button variant="ghost" size="sm" className="text-casino-purple hover:text-casino-purple/80 p-0">
                    Play <CircleArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="casino-card border-casino-blue/20 bg-black/20">
            <div className="p-6">
              <div className="h-12 w-12 rounded-lg bg-casino-blue/20 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-casino-blue">M</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Mines</h3>
              <p className="text-gray-400 text-sm mb-4">Navigate through a minefield to uncover gems and multipliers without getting blown up!</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  <span className="text-casino-green">3,125</span> playing now
                </div>
                <Button variant="ghost" size="sm" className="text-casino-blue hover:text-casino-blue/80 p-0">
                  Play <CircleArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularNow;
