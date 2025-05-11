import React, { useState } from 'react';
import { toast } from 'sonner';
import DiceDisplay from './diceDisplay';
import BetControls from './betControls';
import PredictionSelector, { PredictionType, DiceValueOption } from './predictionStats';
import GameHistory, { GameResult } from './gameHistory';
import GameStats from './gameStats';

const DiceGame: React.FC = () => {
    const [balance, setBalance] = useState(1000);
    const [betAmount, setBetAmount] = useState(10);
    const [prediction, setPrediction] = useState<PredictionType>('under');
    const [selectedValue, setSelectedValue] = useState<DiceValueOption>(4);
    const [diceValue, setDiceValue] = useState<number>(1);
    const [isRolling, setIsRolling] = useState(false);
    const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
    const [totalBets, setTotalBets] = useState(0);
    const [totalWins, setTotalWins] = useState(0);
    const [profit, setProfit] = useState(0);

    const rollDice = () => {
        if (betAmount <= 0) {
            toast.error("Bet amount must be greater than zero.");
            return;
        }

        if (betAmount > balance) {
            toast.error("Insufficient balance to place this bet.");
            return;
        }

        setIsRolling(true);
        setBalance((prev) => prev - betAmount); // Deduct bet amount immediately

        const rollDuration = 1500; // Duration of dice rolling animation
        const startTime = Date.now();

        const rollInterval = setInterval(() => {
            const randomValue = Math.floor(Math.random() * 6) + 1;
            setDiceValue(randomValue);

            if (Date.now() - startTime > rollDuration) {
                clearInterval(rollInterval);
                finalizeRoll();
            }
        }, 100);
    };

    const finalizeRoll = () => {
        const finalDiceValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalDiceValue);

        const isWin = checkWinCondition(finalDiceValue);
        const payout = calculatePayout(isWin);

        setTimeout(() => {
            updateGameStats(isWin, payout);
            addToGameHistory(finalDiceValue, isWin, payout);
            setIsRolling(false);
        }, 500);
    };

    const checkWinCondition = (diceValue: number): boolean => {
        return prediction === 'under'
            ? diceValue < selectedValue
            : diceValue > selectedValue;
    };

    const calculatePayout = (isWin: boolean): number => {
        if (!isWin) return 0;

        const winChance = prediction === 'under'
            ? (selectedValue - 1) / 6
            : (6 - selectedValue) / 6;

        const multiplier = winChance > 0 ? 0.97 / winChance : 0;
        return Math.floor(betAmount * multiplier * 100) / 100;
    };

    const updateGameStats = (isWin: boolean, payout: number) => {
        if (isWin) {
            setBalance((prev) => Math.round((prev + payout) * 100) / 100);
            setTotalWins((prev) => prev + 1);
            toast.success(`You won ${payout.toFixed(2)}!`);
        } else {
            toast.error(`You lost ${betAmount.toFixed(2)}.`);
        }

        setTotalBets((prev) => prev + 1);
        setProfit((prev) =>
            isWin ? prev + payout - betAmount : prev - betAmount
        );
    };

    const addToGameHistory = (diceValue: number, isWin: boolean, payout: number) => {
        const historyItem: GameResult = {
            id: Date.now(),
            diceValue,
            prediction,
            predictedValue: selectedValue,
            betAmount,
            payout,
            timestamp: new Date(),
        };

        setGameHistory((prev) => [historyItem, ...prev.slice(0, 19)]); // Limit history to 20 items
    };

    return (
        <div className="w-full pb-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <div className="mb-8">
                <GameStats
                    balance={balance}
                    totalBets={totalBets}
                    totalWins={totalWins}
                    profit={profit}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="flex flex-col items-center space-y-8">
                    <div className="dice-container w-40 h-40 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
                        <DiceDisplay
                            value={diceValue}
                            rolling={isRolling}
                            size="lg"
                            className="text-game-accent"
                        />
                    </div>
                    <PredictionSelector
                        selectedPrediction={prediction}
                        setSelectedPrediction={setPrediction}
                        selectedValue={selectedValue}
                        setSelectedValue={setSelectedValue}
                        isRolling={isRolling}
                    />
                    <BetControls
                        betAmount={betAmount}
                        setBetAmount={setBetAmount}
                        balance={balance}
                        isRolling={isRolling}
                        onRoll={rollDice}
                    />
                </div>
                <div>
                    <GameHistory history={gameHistory} />
                </div>
            </div>
        </div>
    );
};

export default DiceGame;
