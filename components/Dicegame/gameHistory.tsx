import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import DiceDisplay from './diceDisplay';
import { cn } from '@/lib/utils';

export type GameResult = {
    id: number;
    diceValue: number;
    prediction: 'under' | 'over';
    predictedValue: number;
    betAmount: number;
    payout: number;
    timestamp: Date;
};

interface GameHistoryProps {
    history: GameResult[];
}

const GameHistory: React.FC<GameHistoryProps> = ({ history }) => {
    const isWin = (result: GameResult) => {
        if (result.prediction === 'under') {
            return result.diceValue < result.predictedValue;
        } else {
            return result.diceValue > result.predictedValue;
        }
    };

    return (
        <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Game History
            </h3>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-2">
                {history.length === 0 ? (
                    <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
                        No games played yet
                    </div>
                ) : (
                    <ScrollArea className="h-[280px]">
                        <div className="space-y-2 p-2">
                            {history.map((result) => (
                                <div
                                    key={result.id}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-lg transition-colors",
                                        isWin(result)
                                            ? "bg-green-100 dark:bg-green-900"
                                            : "bg-red-100 dark:bg-red-900"
                                    )}
                                >
                                    <div className="flex items-center space-x-4">
                                        <DiceDisplay value={result.diceValue} size="sm" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                Roll {result.prediction === 'under' ? 'under' : 'over'}{' '}
                                                {result.predictedValue}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(result.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className={cn(
                                            "text-right",
                                            isWin(result)
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-red-600 dark:text-red-400"
                                        )}
                                    >
                                        <p className="text-sm font-medium">
                                            {isWin(result) ? '+' : '-'}
                                            {isWin(result) ? result.payout : result.betAmount}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </div>
    );
};

export default GameHistory;
