import { WalletComponents } from './ConnectWallet';
import React from 'react';
import Link from 'next/link';
import { Dices } from "lucide-react";
import { ModeToggle } from './toggleTheme';
import Image from 'next/image';
const Header: React.FC = () => {
  return (
    <header className="backdrop-blur-md bg-white/70 dark:bg-black/30 border-b border-gray-300 dark:border-gray-700 sticky top-0 z-50 mb-6">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-2">
         <Image src={"/logo.png"} alt="Logo" width={50} height={50} className="h-10 w-10 rounded-full" />
        </div>

        <nav className="hidden md:flex items-center space-x-4">
          <Link href="/plinko" className="nav-link text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
            Plinko
          </Link>
          <Link href="/Dicegame" className="nav-link text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
            Dice
          </Link>
          <Link href="/mines" className="nav-link text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
            Mines
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <ModeToggle />
          <WalletComponents />
        </div>
      </div>
    </header>
  );
};

export default Header;