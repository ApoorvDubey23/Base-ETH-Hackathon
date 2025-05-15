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
    const lowerBound = 0.5 * targetMultiplier;
    let randFactor: number;
    if (targetMultiplier <= 30) {

      randFactor = Math.random() * (2 - 0.5) + 0.5;
    } else {

      randFactor = Math.random() * (1.5 - 0.5) + 0.5;
    }
    const X = targetMultiplier * randFactor;

    const result = Math.random() * (X - lowerBound) + lowerBound;
    return result;
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

    const newBalance = balance - betAmount;
    onBalanceChange(newBalance);

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
    <div className="flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-700 mb-10 dark:text-gray-100">
      <main className="max-w-5xl w-full mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Bet Controls */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Bet Amount</h2>
                <div className="flex items-center space-x-3">
                  <Input
                    type="number"
                    min={0.001}
                    step={0.001}
                    max={balance}
                    value={betAmount}
                    onChange={handleBetAmountChange}
                    className="flex-grow bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">ETH</span>
                </div>
                <div className="flex justify-between mt-4 bg">
                  {[25, 50, 75, 100].map((pct) => (
                    <Button
                      key={pct}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickSetAmount(pct)}
                      className="text-xs border-gray-300 dark:border-gray-600 hover:bg-gray-500 dark:hover:bg-gray-700 bg-gray-200"
                    >
                      {pct}%
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Target Multiplier</h2>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Win Chance: {winChance}%</span>
                </div>
                <p className="mb-2 text-md">
                  Current Multiplier: <span className="font-semibold">{targetMultiplier.toFixed(2)}x</span>
                </p>
                <div className="mb-5">
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
                <div className="grid grid-cols-5 gap-3">
                  {[1.5, 2, 5, 10, 20].map((value) => (
                  <Button
                    key={value}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSetMultiplier(value)}
                    className="text-xs border-gray-300 dark:border-gray-600 hover:bg-gray-500 dark:hover:bg-gray-700 bg-gray-200"

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
                  className="w-full h-16 text-lg text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-md transition-colors disabled:opacity-50"
                >
                  {isRolling ? "Rolling..." : "Play"}
                </Button>
              </div>
            </div>
            {/* Result View */}
            <div className="relative flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-8 shadow-inner min-h-[300px]">
              {rollResult === null ? (
                <div className="text-center">
                  {isRolling ? (
                    <div className="space-y-5">
                      <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 animate-pulse">
                        Rolling...
                      </div>
                      <div className="h-20 w-20 border-4 border-t-indigo-600 border-gray-300 dark:border-gray-500 rounded-full animate-spin mx-auto"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Place Your Bet
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Choose your target multiplier and bet amount. A higher multiplier offers bigger rewards.
                      </p>
                      <div className="flex justify-center mt-4">
                        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-300 mb-1">Target Multiplier</p>
                          <p className="text-3xl font-bold text-indigo-400">
                            {targetMultiplier.toFixed(2)}x
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Roll Result</h3>
                  <div
                    className={`text-6xl font-bold mb-4 ${
                      rollResult >= targetMultiplier ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {rollResult.toFixed(2)}x
                  </div>
                  <p
                    className={`text-lg ${
                      rollResult >= targetMultiplier ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {resultMessage}
                  </p>
                  <Button
                    onClick={() => setRollResult(null)}
                    variant="outline"
                    className="mt-6 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    New Bet
                  </Button>
                </div>
              )}
              {targetMultiplier > 1.01 && !isRolling && rollResult === null && (
                <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-600 dark:text-gray-400">
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
