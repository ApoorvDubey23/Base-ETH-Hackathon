import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

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
            <Card className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <CardContent className="p-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{balance.toFixed(2)}</p>
                </CardContent>
            </Card>
            <Card className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <CardContent className="p-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Bets</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalBets}</p>
                </CardContent>
            </Card>
            <Card className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <CardContent className="p-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{winRate}%</p>
                </CardContent>
            </Card>
            <Card className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
                <CardContent className="p-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Profit/Loss</p>
                    <p
                        className={`text-2xl font-semibold ${
                            profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}
                    >
                        {profit >= 0 ? '+' : ''}
                        {profit.toFixed(2)}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default GameStats;
