"use client";
import React, { useState, useEffect, useRef } from "react";
import { BallManager } from "@/utils/plinko/classes/BallManager";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStakeGameFunctions } from "@/ContractFunctions/functions";
import { ethers } from "ethers";
import { CONTRACT_ABI } from "@/lib/contract";
import { useTheme } from "next-themes";
import Header from "@/components/Header";
import { outcomes } from "@/utils/plinko/outcomes";
import { useToast } from "@/contexts/toast/toastContext";
import { ClipLoader } from "react-spinners";
import Footer from "@/components/Footer";
import { PlaceBet, Withdraw } from "@/utils/helpers";
import BetHistory from "@/components/BetHistory";

interface BetRecord {
  sessionId: number;
  betAmount: number;
  multiplier: number;
  reward: number;
}

export default function Game() {
  const { placeBet, getBalance, address, withdrawWinnigs } =
    useStakeGameFunctions();

  const [ballManager, setBallManager] = useState<BallManager>();
  const [reward, setReward] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState<number | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [wallet, setWallet] = useState<number>(100);
  const [betAmount, setBetAmount] = useState<number>(0.0001);
  const [betHistory, setBetHistory] = useState<BetRecord[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const toast = useToast();
  const [isStartingGame, setIsStartingGame] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const manager = new BallManager(
        canvasRef.current,
        theme as "dark" | "light",
        () => {
          setShowResult(true);
        }
      );
      setBallManager(manager);
    }
  }, [theme]);
  const fetchBalance = async () => {
    if (address) {
      const balancevar = await getBalance();
      setBalance(balancevar);
      console.log("Balance:", balancevar);
    }
  };
  useEffect(() => {
    fetchBalance();
  }, [address]);

  const BET_PLACED_EVENT_SIGNATURE = ethers.id(
    "BetPlaced(uint256,address,uint8,uint256)"
  );

  const startGame = async () => {
    if (betAmount <= 0) {
      toast.open({
        message: {
          heading: "Invalid Bet Amount",
          content: "Please enter a valid bet amount.",
        },
        duration: 5000,
        position: "top-center",
        color: "error",
      });
      return;
    }

    if (wallet < betAmount) {
      toast.open({
        message: {
          heading: "Insufficient Balance",
          content: "You do not have enough balance to place this bet.",
        },
        duration: 5000,
        position: "top-center",
        color: "error",
      });
      return;
    }
    setIsStartingGame(true);
    setReward(null);
    setShowResult(false);
    try {
      const res = (await PlaceBet(
        betAmount,
        placeBet,
        setSessionId,
        toast,
        CONTRACT_ABI,
        BET_PLACED_EVENT_SIGNATURE,
        0
      )) as any;
      console.log("res", res);
      const { multiplier1, point } = res;
      if (multiplier1 == null || point == null) {
        toast.open({
          message: {
            heading: "Transaction Failed",
            content: "Transaction receipt is null.",
          },
          duration: 5000,
          position: "top-center",
          color: "error",
        });
      }

      const gameMultiplier = multiplier1 / 10;
      setMultiplier(gameMultiplier);

      if (ballManager) {
        console.log("finalIndex", point);
        const outcomePoints =
          outcomes[point.toString() as keyof typeof outcomes];
        if (outcomePoints && outcomePoints.length > 0) {
          const randomPoint =
            outcomePoints[Math.floor(Math.random() * outcomePoints.length)];
          ballManager.addBall(randomPoint);
        } else {
          console.error("No outcomes available for the given point:", point);
        }
      }
      const actualReward = betAmount * gameMultiplier;
      setReward(actualReward);
      console.log("data:", multiplier1, point, "actualReward:", actualReward);
      // Save the bet record to bet history.
      fetchBalance();

      setBetHistory((prev) => [
        ...prev,
        {
          sessionId: sessionId!,
          betAmount,
          multiplier: gameMultiplier,
          reward: actualReward,
        },
      ]);
    } catch (error) {
      console.error("Error starting game:", error);
      toast.open({
        message: {
          heading: "Game Start Failed",
          content: "An error occurred while starting the game.",
        },
        duration: 5000,
        position: "top-center",
        color: "error",
      });
    } finally {
      setIsStartingGame(false);
    }
  };

  const handleWithdraw = async () => {
    await Withdraw(
      sessionId,
      withdrawWinnigs,
      setIsWithdrawing,
      setSessionId,
      toast
    );
    setReward(null);
    setMultiplier(null);
    setBetAmount(0.0001);
    setBetHistory((prev) =>
      prev.filter((record) => record.sessionId !== sessionId)
    );
    setSessionId(null);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <Header />
      <div className="container mx-auto px-4 py-3 flex justify-end">
        <span className="text-lg font-semibold text-gray-800 dark:text-white p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          Balance: {balance} ETH
        </span>
      </div>

      <div className="flex flex-col lg:flex-row items-start justify-center px-8 gap-10">
       <div className="w-full lg:w-1/3 space-y-8 bg-gray-50 dark:bg-gray-800 p-10 rounded-2xl shadow-xl mt-8 border-2 border-gray-200 dark:border-gray-700 min-w-[400px]">
  <h2 className="text-4xl font-bold mb-8 text-center">Plinko Game</h2>

  <div className="space-y-4">
    <Label className="text-lg font-medium block">Bet Amount (ETH)</Label>
    <Input
      type="number"
      value={betAmount}
      onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
      placeholder="0.0001 ETH"
      className="mb-6 px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
    <div className="flex gap-4 mb-6">
      <Button
        variant="secondary"
        onClick={() => setBetAmount(betAmount * 0.5)}
        className="flex-1 py-3 text-lg font-semibold"
      >
        /2
      </Button>
      <Button
        variant="secondary"
        onClick={() => setBetAmount(betAmount * 2)}
        className="flex-1 py-3 text-lg font-semibold"
      >
        x2
      </Button>
    </div>
  </div>

  <Button
    className="w-full py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition rounded-lg flex items-center justify-center"
    onClick={startGame}
    disabled={isStartingGame || isWithdrawing || !address}
  >
    {!address ? (
      "Connect Wallet to play"
    ) : isStartingGame ? (
      <>
        <ClipLoader size={24} color="#ffffff" />
        <span className="ml-3">Starting Game...</span>
      </>
    ) : (
      "Start Game"
    )}
  </Button>

  <Button
    className="w-full py-4 text-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition rounded-lg flex items-center justify-center"
    onClick={handleWithdraw}
    disabled={isWithdrawing || isStartingGame}
  >
    {isWithdrawing ? (
      <>
        <ClipLoader size={24} color="#ffffff" />
        <span className="ml-3">Withdrawing...</span>
      </>
    ) : (
      "Withdraw"
    )}
  </Button>

  {reward !== null && showResult && (
    <div
      className={`mt-8 p-6 rounded-xl text-center transition shadow-lg ${
        multiplier && multiplier > 10
          ? "bg-green-500 dark:bg-green-600"
          : multiplier === 10
          ? "bg-yellow-500 dark:bg-yellow-600"
          : "bg-red-500 dark:bg-red-600"
      }`}
    >
      <h3 className="text-2xl font-bold mb-2">
        {multiplier && multiplier > 10
          ? "Congratulations!"
          : multiplier === 10
          ? "Break Even"
          : "Better Luck Next Time!"}
      </h3>
      <p className="text-lg">
        {multiplier && multiplier > 10
          ? `You won: ${reward.toFixed(8)} ETH`
          : multiplier === 10
          ? "You broke even."
          : `You left with: ${reward.toFixed(8)} ETH`}
      </p>
    </div>
  )}
</div>


        <div className="flex-1 flex items-center justify-center mt-8">
          <canvas
            ref={canvasRef}
            width="800"
            height="800"
            className="rounded-md shadow-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 transition-colors"
          ></canvas>
        </div>
      </div>
      {/* Bet History Section */}
     
        <BetHistory gameType={0} />
      <Footer />
    </div>
  );
}
