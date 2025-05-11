import React from 'react';
import { Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/toggleTheme';

interface GameHeaderProps {
    className?: string;
}

const GameHeader: React.FC<GameHeaderProps> = ({ className }) => {
    return (
        <header
            className={cn(
                "py-4 px-6 flex items-center justify-between bg-white dark:bg-gray-900 shadow-md dark:shadow-lg transition-colors duration-300",
                className
            )}
        >
            <div className="flex items-center">
                <div className="rounded-full p-3 mr-4 shadow-md bg-gray-500 dark:bg-game-accent-dark">
                    <Dices className="w-6 h-6 text-gray-900 dark:text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wide">
                    DiceStake
                </h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
                <Button
                    variant="ghost"
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                    How to Play
                </Button>
                <Button
                    variant="ghost"
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                    Leaderboard
                </Button>
                <Button
                    variant="outline"
                    className="bg-game-accent dark:bg-game-accent-dark dark:text-white  text-black hover:bg-game-accent-light dark:hover:bg-game-accent-light-dark border-none ml-2 px-4 py-2 rounded-md shadow-md transition-transform duration-200 transform hover:scale-105"
                >
                    Add Credits
                </Button>
                <ModeToggle />
            </div>
        </header>
    );
};

export default GameHeader;
