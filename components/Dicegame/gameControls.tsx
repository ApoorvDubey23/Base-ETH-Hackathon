import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface BetControlsProps {
    betAmount: number;
    setBetAmount: (amount: number) => void;
    balance: number;
    isRolling: boolean;
    onRoll: () => void;
}

const BetControls: React.FC<BetControlsProps> = ({
    betAmount,
    setBetAmount,
    balance,
    isRolling,
    onRoll,
}) => {
    const handleQuickBet = (multiplier: number) => {
        const newAmount = Math.min(balance, Math.max(1, Math.floor(betAmount * multiplier)));
        setBetAmount(newAmount);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10) || 0;
        setBetAmount(Math.min(balance, Math.max(0, value)));
    };

    return (
        <div className="flex flex-col space-y-6 w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bet Amount</p>
                    <div className="relative">
                        <Input
                            type="number"
                            value={betAmount}
                            onChange={handleInputChange}
                            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 pr-20 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                            min={1}
                            max={balance}
                            disabled={isRolling}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                onClick={() => handleQuickBet(0.5)}
                                disabled={isRolling}
                            >
                                ½
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                onClick={() => handleQuickBet(2)}
                                disabled={isRolling}
                            >
                                2×
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
                {[5, 10, 25, 50, 100, 250, 500, 'Max'].map((value, index) => (
                    <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (value === 'Max') {
                                setBetAmount(balance);
                            } else {
                                setBetAmount(Math.min(balance, value as number));
                            }
                        }}
                        disabled={isRolling}
                        className={cn(
                            "bg-gray-100 dark:bg-gray-700 hover:bg-blue-500 hover:text-white border border-gray-300 dark:border-gray-600",
                            value === betAmount && "bg-blue-500 text-white"
                        )}
                    >
                        {typeof value === 'number' ? value : value}
                    </Button>
                ))}
            </div>

            <Button
                onClick={onRoll}
                disabled={isRolling || betAmount <= 0 || betAmount > balance}
                className="w-full py-3 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 rounded-md disabled:opacity-50"
            >
                {isRolling ? "Rolling..." : "Roll Dice"}
            </Button>
        </div>
    );
};

export default BetControls;
