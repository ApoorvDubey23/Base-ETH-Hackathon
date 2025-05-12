import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { BetRecord } from './BetHistory';

type LimboGameProps = {
  balance: number;
  onBalanceChange: (newBalance: number) => void;
  onBetComplete: (record: BetRecord) => void;
};

const LimboGame: React.FC<LimboGameProps> = ({ balance, onBalanceChange, onBetComplete }) => {
  const [betAmount, setBetAmount] = useState(0.01);
  const [targetMultiplier, setTargetMultiplier] = useState(2.0);
  const [isRolling, setIsRolling] = useState(false);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [resultMessage, setResultMessage] = useState('');
  const [winChance, setWinChance] = useState(50);

  // Calculate win chance based on target multiplier
  useEffect(() => {
    const chance = Math.min(Math.max((1 / targetMultiplier) * 100, 1), 95);
    setWinChance(parseFloat(chance.toFixed(2)));
  }, [targetMultiplier]);

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setBetAmount(!isNaN(value) && value > 0 ? Math.min(value, balance) : 0);
  };

  const handleMultiplierChange = (value: number[]) => {
    setTargetMultiplier(value[0]);
  };

  const handleQuickSetAmount = (percentage: number) => {
    const amount = balance * (percentage / 100);
    setBetAmount(parseFloat(amount.toFixed(4)));
  };

  const handleQuickSetMultiplier = (value: number) => {
    setTargetMultiplier(value);
  };

  const generateRandomMultiplier = () => {
    return Math.random() * 20 + 1;
  };

  const handlePlay = () => {
    if (betAmount <= 0) {
      toast.error("Please enter a bet amount");
      return;
    }
    if (betAmount > balance) {
      toast.error("Insufficient balance");
      return;
    }
    setIsRolling(true);
    setRollResult(null);
    setResultMessage('');

    // Deduct bet amount immediately
    const newBalance = balance - betAmount;
    onBalanceChange(newBalance);

    // Simulate rolling animation
    setTimeout(() => {
      const result = generateRandomMultiplier();
      setRollResult(result);
      const win = result >= targetMultiplier;
      setTimeout(() => {
        if (win) {
          const winAmount = betAmount * targetMultiplier;
          onBalanceChange(newBalance + winAmount);
          setResultMessage(`You won ${winAmount.toFixed(4)} ETH!`);
          toast.success(`You won ${winAmount.toFixed(4)} ETH!`);
        } else {
          setResultMessage(`You lost ${betAmount.toFixed(4)} ETH`);
          toast.error(`You lost ${betAmount.toFixed(4)} ETH`);
        }

        const record: BetRecord = {
          id: Date.now(),
          amount: betAmount,
          targetMultiplier,
          resultMultiplier: result,
          win,
          timestamp: new Date()
        };
        onBetComplete(record);
        setIsRolling(false);
      }, 500);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow-md animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left-side: Bet controls */}
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Bet Amount</h2>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    min={0.001}
                    step={0.001}
                    max={balance}
                    value={betAmount}
                    onChange={handleBetAmountChange}
                    className="flex-grow bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-800 dark:text-gray-100"
                  />
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">ETH</span>
                </div>
                <div className="flex justify-between mt-3">
                  {[25, 50, 75, 100].map((pct) => (
                    <Button
                      key={pct}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSetAmount(pct)}
                      className="text-xs border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {pct}%
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Target Multiplier</h2>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Win Chance: {winChance}%</span>
                </div>
                <div className="mb-4">
                  <Slider
                    value={[targetMultiplier]}
                    min={1.01}
                    max={50}
                    step={0.01}
                    onValueChange={handleMultiplierChange}
                    className="mb-1"
                  />
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>1.01x</span>
                    <span>50.00x</span>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[1.5, 2, 5, 10, 20].map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSetMultiplier(value)}
                      className="text-xs border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {value}x
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Button
                  onClick={handlePlay}
                  disabled={isRolling || betAmount <= 0 || betAmount > balance}
                  className="w-full h-16 text-lg text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  {isRolling ? "Rolling..." : "Play"}
                </Button>
              </div>
            </div>
            {/* Right-side: Result view */}
            <div className="relative flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-8 shadow-inner min-h-[300px]">
              {rollResult === null ? (
                <div className="text-center">
                  {isRolling ? (
                    <div className="space-y-4">
                      <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 animate-pulse">
                        Rolling...
                      </div>
                      <div className="h-20 w-20 border-4 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                        Choose your target and place your bet
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        The higher your target multiplier, the bigger your potential win
                      </p>
                      <div className="flex justify-center mt-4">
                        <div className="bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-300 mb-1">Target Multiplier</p>
                          <p className="text-3xl font-bold text-indigo-600">
                            {targetMultiplier.toFixed(2)}x
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center animate-number-roll">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Roll Result</h3>
                  <div className={`text-6xl font-bold mb-4 ${rollResult >= targetMultiplier ? 'text-green-500' : 'text-red-500'}`}>
                    {rollResult.toFixed(2)}x
                  </div>
                  <p className={`text-lg ${rollResult >= targetMultiplier ? 'text-green-500' : 'text-red-500'}`}>
                    {resultMessage}
                  </p>
                  <Button
                    onClick={() => setRollResult(null)}
                    variant="outline"
                    className="mt-6 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    New Bet
                  </Button>
                </div>
              )}
              {targetMultiplier > 1.01 && !isRolling && rollResult === null && (
                <div className="absolute bottom-4 left-0 right-0 mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
                  Potential Win: {(betAmount * targetMultiplier).toFixed(4)} ETH
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default LimboGame;
