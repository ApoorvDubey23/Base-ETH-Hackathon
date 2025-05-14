"use client";
import React, { useState, useEffect, useRef } from "react";
import { BallManager } from "@/utils/plinko/classes/BallManager";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStakeGameFunctions } from "@/ContractFunctions/functions";
import { WalletComponents } from "@/components/ConnectWallet";
import { ethers } from "ethers";
import { CONTRACT_ABI } from "@/lib/contract";
import { ModeToggle } from "@/components/toggleTheme";
import { useTheme } from "next-themes";

export default function Game() {
  const {
    placeBet,
    getGameResultPlinko,
    getBalance,
    address,
    getSigner,
    withdrawWinnigs
  } = useStakeGameFunctions();

  const [ballManager, setBallManager] = useState<BallManager>();
  const [reward, setReward] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [wallet, setWallet] = useState<number>(100);
  const [betAmount, setBetAmount] = useState<number>(0.0001);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (canvasRef.current) {
      const manager = new BallManager(canvasRef.current, theme as "dark" | "light");
      setBallManager(manager);
    }
  }, [theme]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        const balancevar = await getBalance();
        setBalance(balancevar);
        console.log("Balance:", balancevar);
      }
    };
    fetchBalance();
  }, [address]);

  const BET_PLACED_EVENT_SIGNATURE = ethers.id("BetPlaced(uint256,address,uint8,uint256)");

  const handlePlaceBet = async () => {
    if (betAmount <= 0) {
      alert("Please enter a valid bet amount.");
      return;
    }

    try {
      const receipt = await placeBet(betAmount, 0); // 0 = Plinko

      // Find the BetPlaced event log
      const log = receipt.logs.find(
        (log: any) =>
          log.topics[0].toLowerCase() === BET_PLACED_EVENT_SIGNATURE.toLowerCase()
      );

      if (!log) throw new Error("BetPlaced event not found in logs");

      // Decode using Interface
      const iface = new ethers.Interface(CONTRACT_ABI);
      const decoded = iface.decodeEventLog("BetPlaced", log.data, log.topics);

      const sessionId = Number(decoded.sessionId);
      setSessionId(sessionId);

      console.log("✅ Bet placed with sessionId:", sessionId, "for amount of ", betAmount);
    } catch (error) {
      console.error("❌ Bet failed:", error);
      alert("Bet failed. Check console for details.");
    }
  };

  const startGame = async () => {
    try {
      if (sessionId === null) {
        alert("No session found. Please place a bet first.");
        return;
      }

      if (betAmount <= 0) {
        alert("Please enter a valid bet amount.");
        return;
      }

      if (wallet < betAmount) {
        alert("Insufficient balance!");
        return;
      }

      const { multiplier1, point } = await getGameResultPlinko(sessionId!);

      setMultiplier(multiplier1 / 10);

      const actualReward = betAmount * (multiplier1 / 10);
      setReward(actualReward);
      console.log("data:", multiplier1, point, "actualReward:", actualReward);

      if (ballManager) {
        const finalIndex = Math.floor(point);
        console.log("finalIndex", finalIndex);

        ballManager.addBall(finalIndex);
      }
    } catch (error) {
      console.error("Error starting game:", error);
      alert("Error starting game. Check console for details.");
    }
  };

  const handleWithdraw = async () => {
    if (sessionId === null) {
      alert("No session found to resolve.");
      return;
    }

    try {
      console.log("Starting withdrawal...");
      const { payout } = await withdrawWinnigs(sessionId);
      alert(`✅ Withdrawal successful! You received ${payout} ETH`);

      setReward(null);
      setMultiplier(null);
      setSessionId(null);
    } catch (error: any) {
      console.error("Withdraw failed:", error);

      const msg = error?.message?.toLowerCase() || "";

      if (msg.includes("already resolved")) {
        alert("⚠️ This session has already been resolved.");
      } else if (msg.includes("invalid session")) {
        alert("❌ Invalid session ID.");
      } else if (msg.includes("transfer failed")) {
        alert("❌ ETH transfer failed. Try again later.");
      } else if (msg.includes("withdrawal event not found")) {
        alert("⚠️ No withdrawal event found. Please check manually.");
      } else {
        alert("❌ Withdrawal failed. See console for details.");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center min-h-screen p-6 gap-8 bg-gray-900 text-white">
      <header className="fixed top-0 left-0 w-full bg-gray-800 p-4 shadow-md z-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Plinko Game</h1>
        <div className="flex items-center bg-gray-700 p-2 rounded-lg">
          <h3 className="text-sm font-bold mr-2">Balance: {balance}</h3>
          <h3 className="text-sm font-bold mr-2">Wallet:</h3>
          <WalletComponents />
        </div>
      </header>

      <div className="w-full max-w-sm space-y-6 bg-gray-800 p-6 rounded-xl shadow-md mt-24 lg:mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Plinko Game</h2>

        <div>
          <Label className="text-sm mb-2 block">Bet Amount (ETH)</Label>
          <Input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
            placeholder="0.0001 ETH"
            className="mb-4"
          />
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setBetAmount(betAmount * 0.5)}>/2</Button>
            <Button variant="secondary" onClick={() => setBetAmount(betAmount * 2)}>x2</Button>
          </div>
        </div>

        {sessionId !== null ? (
          <Button
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            onClick={startGame}
          >
            Start Game
          </Button>
        ) : (
          <Button
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            onClick={handlePlaceBet}
          >
            Place Bet
          </Button>
        )}

        <Button
          className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold"
          onClick={handleWithdraw}
        >
          Withdraw
        </Button>

        {reward !== null && (
          <div
            className={`mt-6 p-4 rounded-lg text-center ${
              multiplier && multiplier > 10
                ? "bg-green-700"
                : multiplier === 10
                ? "bg-orange-600"
                : "bg-red-700"
            }`}
          >
            <h3 className="text-lg font-bold">
              {multiplier && multiplier > 10
                ? "Congratulations!"
                : multiplier === 10
                ? "Not Win, Not Lose"
                : "Better Luck Next Time!"}
            </h3>
            <p className="text-sm">
              {multiplier && multiplier > 10
                ? `You won: ${reward.toFixed(8)} ETH`
                : multiplier === 10
                ? "Broke even."
                : `You left with: ${reward.toFixed(8)} ETH`}
            </p>
          </div>
        )}
      </div>

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
