
import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Dices } from "lucide-react";
import { ModeToggle } from './toggleTheme';

const Header: React.FC = () => {
  return (
    <header className="backdrop-blur-md bg-black/30 border-b border-purple-500/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-2">
          <Dices className="h-6 w-6 text-casino-purple" />
          <span className="text-xl font-bold bg-gradient-to-r from-casino-purple to-casino-blue bg-clip-text text-transparent">LuckyCasino</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
          <Link href="/" className="nav-link active">Games</Link>
          <Link href="/promotions" className="nav-link">Promotions</Link>
          <Link href="/vip" className="nav-link">VIP</Link>
          <Link href="/support" className="nav-link">Support</Link>
          <Link href="/plinko" className="nav-link">Plinko</Link>
          <Link href="/Dicegame" className="nav-link">Dice Game</Link>
        </nav>
        
        <div className="flex items-center space-x-2">
          <ModeToggle />
          <Button variant="outline" className="border-purple-500/50 bg-transparent text-white hover:bg-purple-500/10">Sign In</Button>
          <Button className="bg-casino-purple hover:bg-casino-purple/90">Register</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
