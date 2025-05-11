import React from 'react';
import GameHeader from '@/components/Dicegame/gameHeader';
import DiceGame from '@/components/Dicegame/DiceGame';
import { Separator } from '@/components/ui/separator';

const Index = () => {
    return (
        <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white flex flex-col">
            <GameHeader />
            <Separator className="bg-gray-300 dark:bg-gray-700" />
            <main className="flex-1 container mx-auto px-4 py-8">
                <DiceGame />
            </main>
            <footer className="text-center p-4 text-gray-600 dark:text-gray-400 text-sm">
                <p>© 2025 DiceStake | For entertainment purposes only</p>
            </footer>
        </div>
    );
};

export default Index;