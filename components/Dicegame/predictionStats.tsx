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
            return Math.max(1, Math.round(((selectedValue - 1) / 6) * 100));
        } else {
            return Math.max(1, Math.round(((6 - selectedValue) / 6) * 100));
        }
    };
    
    const calculateMultiplier = () => {
        if (selectedPrediction === 'under') {
            const mapping: Record<DiceValueOption, number> = {
                1: 100,
                2: 2,
                3: 1.75,
                4: 1.2,
                5: 1.0,
                6: 0.5,
            };
            return mapping[selectedValue].toFixed(2);
        } else {
            const mapping: Record<DiceValueOption, number> = {
                1: 0.5,
                2: 1.0,
                3: 1.2,
                4: 1.75,
                5: 2,
                6: 100,
            };
            return mapping[selectedValue].toFixed(2);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-indigo-400 dark:border-indigo-300 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <Button
                    variant={selectedPrediction === 'under' ? 'default' : 'outline'}
                    className={cn(
                        "flex-1 rounded-r-none border-r-0",
                        selectedPrediction === 'under'
                            ? "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 dark:from-green-700 dark:to-blue-700"
                            : "bg-gray-200 dark:bg-gray-800 text-indigo-800 dark:text-indigo-200 hover:bg-gray-300 dark:hover:bg-gray-700 border border-indigo-400 dark:border-indigo-300"
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
                            ? "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 dark:from-green-700 dark:to-blue-700"
                            : "bg-gray-200 dark:bg-gray-800 text-indigo-800 dark:text-indigo-200 hover:bg-gray-300 dark:hover:bg-gray-700 border border-indigo-400 dark:border-indigo-300"
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
                            "border border-indigo-400 dark:border-indigo-300 text-lg font-medium p-0 h-12 rounded",
                            "bg-gray-100 dark:bg-gray-800 text-indigo-800 dark:text-indigo-200 hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-500 hover:text-white",
                            selectedValue === value && "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                        )}
                        onClick={() => handleValueChange(value)}
                        disabled={isRolling}
                    >
                        {value}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center shadow-lg border border-indigo-400 dark:border-indigo-300">
                    <p className="text-indigo-800 dark:text-indigo-200 text-sm mb-1">Win Chance</p>
                    <p className="text-gray-900 dark:text-white font-bold text-lg">{calculateWinChance()}%</p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center shadow-lg border border-indigo-400 dark:border-indigo-300">
                    <p className="text-indigo-800 dark:text-indigo-200 text-sm mb-1">Multiplier</p>
                    <p className="text-gray-900 dark:text-white font-bold text-lg">{calculateMultiplier()}x</p>
                </div>
            </div>
        </div>
    );
};

export default PredictionSelector;
