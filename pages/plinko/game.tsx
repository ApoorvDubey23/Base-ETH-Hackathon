import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BallManager } from "@/utils/plinko/classes/BallManager";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function Game() {
  const baseURL = "http://localhost:3000";
  const [ballManager, setBallManager] = useState<BallManager>();
  const [reward, setReward] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState<number | null>(null);
  const [wallet, setWallet] = useState<number>(100); 
  const [betAmount, setBetAmount] = useState<number>(0.0001);   
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const manager = new BallManager(canvasRef.current);
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
      
      // Calculate the actual reward based on bet amount and multiplier
      const parsedMultiplier = parseFloat(apiMultiplier) || 0;
      const actualReward = betAmount * parsedMultiplier;
      
      setReward(actualReward);
      setMultiplier(parsedMultiplier);
  
      // Update wallet balance with the actual reward
      const newBalance = wallet - betAmount + actualReward;
      setWallet(newBalance);
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
    setBetAmount(parseFloat(newBet.toFixed(8))); // Ensure precision
  };

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center min-h-screen p-6 gap-8 bg-gray-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-gray-800 p-4 shadow-md z-10 flex items-center justify-between">
  <h1 className="text-2xl font-bold text-center text-white">Plinko Game</h1>
  <div className="flex items-center bg-gray-700 p-2 rounded-lg">
    <h3 className="text-sm font-bold mr-2">Wallet:</h3>
    <p className="text-sm">{wallet.toFixed(8)} BTC</p>
  </div>
</header>

 

      {/* Left Panel */}
      <div className="w-full max-w-sm space-y-6 bg-gray-800 p-6 rounded-xl shadow-md mt-24 lg:mt-8">
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
            className={`mt-6 p-4 rounded-lg text-center ${
              multiplier && multiplier > 1 
                ? "bg-green-700" 
                : multiplier === 1 
                  ? "bg-orange-600" // Orange background for 1x multiplier
                  : "bg-red-700"
            }`}
          >
            <h3 className="text-lg font-bold">
              {multiplier && multiplier > 1 
                ? "Congratulations!" 
                : multiplier === 1 
                  ? "Not Win, Not Lose" // Special message for 1x multiplier
                  : "Better Luck Next Time!"}
            </h3>
            <p className="text-sm">
              {multiplier && multiplier > 1 
                ? `You won: ${reward.toFixed(8)} BTC`
                : multiplier === 1
                  ? "Better luck next time!" // Message for 1x multiplier
                  : typeof reward === "number"
                    ? `You lost: ${Math.abs(reward).toFixed(8)} BTC`
                    : ""}
            </p>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width="800"
          height="800"
          className="rounded-md shadow-lg border border-gray-700 bg-gray-800"
        ></canvas>
      </div>
    </div>
  );
}
