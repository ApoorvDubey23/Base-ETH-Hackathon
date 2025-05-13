import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type GameNavProps = {
  balance: number;
};

const GameNav: React.FC<GameNavProps> = ({ balance }) => {
  return (
    <nav className="w-full py-4 px-6 flex justify-between items-center bg-gray-50 dark:bg-gray-900 rounded-lg mb-6 shadow-md">
      <div className="flex items-center space-x-6">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Limbo</h1>
        <div className="hidden md:flex space-x-4">
          <Link
            href="/"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Game
          </Link>
          <Link
            href="/history"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            History
          </Link>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-2 px-4 rounded-md flex items-center shadow-sm">
          <span className="mr-2 text-indigo-600 dark:text-indigo-400">ETH</span>
          <span className="font-mono text-gray-900 dark:text-gray-100">{balance.toFixed(4)}</span>
        </div>
        <Button
          variant="outline"
          className="border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 dark:hover:bg-indigo-400 hover:text-white transition-colors"
        >
          Deposit
        </Button>
      </div>
    </nav>
  );
};

export default GameNav;
