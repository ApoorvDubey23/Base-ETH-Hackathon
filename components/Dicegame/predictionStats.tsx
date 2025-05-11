import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type PredictionType = 'under' | 'over';
export type DiceValueOption = 1 | 2 | 3 | 4 | 5 | 6;

interface PredictionSelectorProps {
    selectedPrediction: PredictionType;
    setSelectedPrediction: (prediction: PredictionType) => void;
    selectedValue: DiceValueOption;
    setSelectedValue: (value: DiceValueOption) => void;
    isRolling: boolean;
}

const PredictionSelector: React.FC<PredictionSelectorProps> = ({
    selectedPrediction,
    setSelectedPrediction,
    selectedValue,
    setSelectedValue,
    isRolling,
}) => {
    const valueOptions: DiceValueOption[] = [1, 2, 3, 4, 5, 6];

    const handleValueChange = (value: DiceValueOption) => {
        setSelectedValue(value);
    };

    const calculateWinChance = () => {
        if (selectedPrediction === 'under') {
            return Math.round((selectedValue / 6) * 100);
        } else {
            return Math.round(((7 - selectedValue) / 6) * 100);
        }
    };

    const calculateMultiplier = () => {
        const winChance = calculateWinChance() / 100;
        return winChance > 0 ? (0.97 / winChance).toFixed(2) : '0.00';
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-md">
            <div className="flex justify-between items-center mb-6">
                <Button
                    variant={selectedPrediction === 'under' ? 'default' : 'outline'}
                    className={cn(
                        "flex-1 rounded-r-none border-r-0",
                        selectedPrediction === 'under'
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    )}
                    onClick={() => setSelectedPrediction('under')}
                    disabled={isRolling}
                >
                    Roll Under
                </Button>
                <Button
                    variant={selectedPrediction === 'over' ? 'default' : 'outline'}
                    className={cn(
                        "flex-1 rounded-l-none",
                        selectedPrediction === 'over'
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    )}
                    onClick={() => setSelectedPrediction('over')}
                    disabled={isRolling}
                >
                    Roll Over
                </Button>
            </div>

            <div className="grid grid-cols-6 gap-2 mb-6">
                {valueOptions.map((value) => (
                    <Button
                        key={value}
                        variant="outline"
                        className={cn(
                            "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-500 hover:text-white border border-gray-300 dark:border-gray-600 text-lg font-medium p-0 h-12",
                            selectedValue === value && "bg-blue-500 text-white"
                        )}
                        onClick={() => handleValueChange(value)}
                        disabled={isRolling}
                    >
                        {value}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg text-center shadow-sm">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Win Chance</p>
                    <p className="text-gray-900 dark:text-white font-bold text-lg">{calculateWinChance()}%</p>
                </div>
                <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-lg text-center shadow-sm">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Multiplier</p>
                    <p className="text-gray-900 dark:text-white font-bold text-lg">{calculateMultiplier()}x</p>
                </div>
            </div>
        </div>
    );
};

export default PredictionSelector;
