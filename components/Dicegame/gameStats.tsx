import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toScientificNotation } from '@/utils/scientificNotation';

interface GameStatsProps {
    balance: number;
    totalBets: number;
    totalWins: number;
    profit: number;
}

const GameStats: React.FC<GameStatsProps> = ({ balance, totalBets, totalWins, profit }) => {
    const winRate = totalBets > 0 ? Math.round((totalWins / totalBets) * 100) : 0;

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <Card className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md transition-colors duration-300">
                <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Balance</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{toScientificNotation(balance)}</p>
                </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md transition-colors duration-300">
                <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Bets</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{totalBets}</p>
                </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md transition-colors duration-300">
                <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Win Rate</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{winRate}%</p>
                </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md transition-colors duration-300">
                <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Profit/Loss</p>
                    <p
                        className={`text-2xl font-bold ${
                            profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}
                    >
                        {profit >= 0 ? '+' : ''}
                        {toScientificNotation(profit)}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default GameStats;
