import React from 'react';
import DiceGame from '@/components/Dicegame/DiceGame';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
    return (
        <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white flex flex-col">
            <Header />
            <Separator className="bg-gray-300 dark:bg-gray-700" />
            <main className="flex-1 container mx-auto px-4 py-8">
                <DiceGame />
            </main>
            <Footer />
        </div>
    );
};

export default Index;