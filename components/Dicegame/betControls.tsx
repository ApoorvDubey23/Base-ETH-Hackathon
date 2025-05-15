import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ClipLoader } from 'react-spinners';

interface BetControlsProps {
    betAmount: number;
    setBetAmount: (amount: number) => void;
    balance: number;
    isRolling: boolean;
    onRoll: () => void;
    sessionId: number | null;
    handlePlaceBet: () => void;
    isPlacingBet: boolean;
}

const BetControls: React.FC<BetControlsProps> = ({
    betAmount,
    setBetAmount,
    balance,
    isRolling,
    onRoll,
    sessionId,
    handlePlaceBet,
    isPlacingBet,
}) => {
    const handleQuickBet = (multiplier: number) => {
        setBetAmount(betAmount * multiplier);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10) || 1;
        setBetAmount(Math.min(balance, Math.max(1, value)));
    };
    return (
        <div className="flex flex-col space-y-6 w-full max-w-md p-4 bg-white dark:bg-neutral-900 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
                <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-2">
                        Bet Amount
                    </p>
                    <div className="relative">
                        <Input
                            type="number"
                            value={betAmount}
                            onChange={handleInputChange}
                            className="bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 pr-20 rounded-md border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-blue-500"
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

            {sessionId !== null ? (
                <Button
                    onClick={onRoll}
                    disabled={isRolling || isPlacingBet}
                    className="w-full py-3 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isRolling ? (
                        <>
                            <ClipLoader size={20} color="#ffffff" />
                            <span className="ml-2">Rolling...</span>
                        </>
                    ) : (
                        "Roll"
                    )}
                </Button>
            ) : (
                <Button
                    onClick={handlePlaceBet}
                    disabled={isRolling|| betAmount > balance || isPlacingBet}
                    className="w-full py-3 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPlacingBet ? (
                        <>
                            <ClipLoader size={20} color="#ffffff" />
                            <span className="ml-2">Placing Bet...</span>
                        </>
                    ) : (
                        "Place Bet"
                    )}
                </Button>
            )}
        </div>
    );
};

export default BetControls;
