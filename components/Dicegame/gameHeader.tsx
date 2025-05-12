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
                "py-4 px-6 flex items-center justify-between bg-light-surface dark:bg-dark-surface shadow-md dark:shadow-lg transition-colors duration-300",
                className
            )}
        >
            <div className="flex items-center">
                <div className="rounded-full p-3 mr-4 shadow-md bg-light-accent dark:bg-dark-accent">
                    <Dices className="w-6 h-6 text-light-icon dark:text-dark-icon" />
                </div>
                <h1 className="text-2xl font-bold text-light-text dark:text-dark-text tracking-wide">
                    DiceStake
                </h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
                <Button
                    variant="ghost"
                    className="text-light-muted dark:text-dark-muted hover:text-light-hover dark:hover:text-dark-hover hover:bg-light-hover-bg dark:hover:bg-dark-hover-bg transition-colors duration-200"
                >
                    How to Play
                </Button>
                <Button
                    variant="ghost"
                    className="text-light-muted dark:text-dark-muted hover:text-light-hover dark:hover:text-dark-hover hover:bg-light-hover-bg dark:hover:bg-dark-hover-bg transition-colors duration-200"
                >
                    Leaderboard
                </Button>
                <Button
                    variant="outline"
                    className="bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary hover:bg-light-primary-hover dark:hover:bg-dark-primary-hover border-none ml-2 px-4 py-2 rounded-md shadow-md transition-transform duration-200 transform hover:scale-105"
                >
                    Add Credits
                </Button>
                <ModeToggle />
            </div>
        </header>
    );
};

export default GameHeader;
