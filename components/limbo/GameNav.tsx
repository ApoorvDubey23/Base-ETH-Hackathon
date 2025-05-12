import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type GameNavProps = {
  balance: number;
};

const GameNav: React.FC<GameNavProps> = ({ balance }) => {
  return (
    <nav className="w-full py-4 px-6 flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg mb-6 shadow">
      <div className="flex items-center space-x-6">
        <h1 className="text-2xl font-bold text-indigo-600">Limbo</h1>
        <div className="hidden md:flex space-x-4">
          <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors">
            Game
          </Link>
          <Link href="/history" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors">
            History
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="bg-gray-700 dark:bg-gray-600 p-2 px-4 rounded-md flex items-center">
          <span className="mr-2 text-indigo-600">ETH</span>
          <span className="font-mono text-white">{balance.toFixed(4)}</span>
        </div>
        <Button
          variant="outline"
          className="border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors"
        >
          Deposit
        </Button>
      </div>
    </nav>
  );
};

export default GameNav;
