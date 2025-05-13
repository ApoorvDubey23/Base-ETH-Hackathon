import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BallManager } from "@/utils/plinko/classes/BallManager";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/toggleTheme";
import { useTheme } from "next-themes";

export default function Game() {
  const baseURL = "http://localhost:3000";
  const [ballManager, setBallManager] = useState<BallManager>();
  const [reward, setReward] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState<number | null>(null);
  const [wallet, setWallet] = useState<number>(100);
  const [betAmount, setBetAmount] = useState<number>(0.0001);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const {theme}=useTheme();
  console.log(theme)
  useEffect(() => {
    if (canvasRef.current) {
      const manager = new BallManager(canvasRef.current,theme as "dark"||"light");
      setBallManager(manager);
    }
  }, [canvasRef]);

  const handleBet = async () => {
    if (betAmount <= 0) {
      alert("Please enter a valid bet amount.");
      return;
    }

    if (wallet < betAmount) {
      alert("Insufficient balance!");
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/api/plinko`, { data: betAmount });
      const { point, reward: apiReward, multiplier: apiMultiplier } = response.data;

      if (ballManager) {
        ballManager.addBall(point);
        const parsedMultiplier = parseFloat(apiMultiplier) || 0;
        const actualReward = betAmount * parsedMultiplier;
        setReward(actualReward);
        setMultiplier(parsedMultiplier);
        setWallet(wallet - betAmount + actualReward);
      }
    } catch (error) {
      console.error("Error placing bet:", error);
      alert("An error occurred while placing your bet. Please try again.");
    }
  };

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setBetAmount(isNaN(value) ? 0 : value);
  };

  const adjustBet = (factor: number) => {
    const newBet = betAmount * factor;
    setBetAmount(parseFloat(newBet.toFixed(8)));
  };

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center min-h-screen p-6 gap-8 transition-colors duration-300 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full p-4 shadow-md z-10 flex items-center justify-between transition-colors duration-300 bg-gray-100 dark:bg-gray-800">
        <h1 className="text-2xl font-bold">Plinko Game</h1>
        <div className="flex items-center px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700">
          <h3 className="text-sm font-bold mr-2">Wallet:</h3>
          <p className="text-sm">{wallet.toFixed(8)} BTC</p>
        </div>
        <ModeToggle />
      </header>

      {/* Left Panel */}
      <div className="w-full max-w-sm space-y-6 mt-24 lg:mt-8 p-6 rounded-xl shadow-lg transition-colors duration-300 bg-gray-100 dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center">Plinko Game</h2>
        <div>
          <Label className="text-sm mb-2 block">Bet Amount</Label>
          <Input
            type="number"
            value={betAmount}
            onChange={handleBetChange}
            placeholder="0.0000001 BTC"
            className="mb-4"
          />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => adjustBet(0.5)}>
              /2
            </Button>
            <Button variant="secondary" onClick={() => adjustBet(2)}>
              x2
            </Button>
          </div>
        </div>

        <Button
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          onClick={handleBet}
        >
          Place Bet
        </Button>

        {reward !== null && (
          <div
            className={`mt-6 p-4 rounded-lg text-center transition-colors duration-300 ${
              multiplier && multiplier > 1
                ? "bg-green-600"
                : multiplier === 1
                ? "bg-orange-500"
                : "bg-red-600"
            }`}
          >
            <h3 className="text-lg font-bold">
              {multiplier && multiplier > 1
                ? "Congratulations!"
                : multiplier === 1
                ? "Not Win, Not Lose"
                : "Better Luck Next Time!"}
            </h3>
            <p className="text-sm">
              {multiplier && multiplier > 1
                ? `You won: ${reward.toFixed(8)} BTC`
                : multiplier === 1
                ? "Better luck next time!"
                : typeof reward === "number"
                ? `You lost: ${Math.abs(reward).toFixed(8)} BTC`
                : ""}
            </p>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center mt-24 lg:mt-8">
        <canvas
          ref={canvasRef}
          width="800"
          height="800"
          className="rounded-md shadow-lg border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-700"
        ></canvas>
      </div>
    </div>
  );
}
