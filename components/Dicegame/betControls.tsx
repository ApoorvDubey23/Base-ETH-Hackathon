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
        <div className="flex flex-col space-y-4 w-full max-w-md">
            <div className="flex items-center space-x-3">
                <div className="flex-1">
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-1">Bet Amount</p>
                    <div className="relative">
                        <Input
                            type="number"
                            value={betAmount}
                            onChange={handleInputChange}
                            className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 pr-16"
                            min={1}
                            max={balance}
                            disabled={isRolling}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 px-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                onClick={() => handleQuickBet(0.5)}
                                disabled={isRolling}
                            >
                                ½
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-7 px-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                onClick={() => handleQuickBet(2)}
                                disabled={isRolling}
                            >
                                2×
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
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
                            "bg-neutral-100 dark:bg-neutral-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 border-neutral-300 dark:border-neutral-700",
                            value === betAmount && "bg-blue-600 text-white dark:bg-blue-500"
                        )}
                    >
                        {typeof value === 'number' ? value : value}
                    </Button>
                ))}
            </div>

            <Button 
                onClick={onRoll}
                disabled={isRolling || betAmount <= 0 || betAmount > balance}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white font-semibold py-6 text-lg"
            >
                {isRolling ? "Rolling..." : "Roll Dice"}
            </Button>
        </div>
    );
};

export default BetControls;
