import React from 'react';
import DiceGame from '@/components/Dicegame/DiceGame';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BetHistory from '@/components/BetHistory';

const Index = () => {
    return (
        <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white flex flex-col">
            <Header />
            <Separator className="bg-gray-300 dark:bg-gray-700" />
            <main className="flex-1 container mx-auto px-4 py-8">
                <DiceGame />
            </main>
            <div className="mt-8 w-[80%] bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center mx-auto flex-col mb-10">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
                    Bet History
                </h2>
                <BetHistory gameType={1} />
            </div>
            <Footer />
        </div>
    );
};

export default Index;