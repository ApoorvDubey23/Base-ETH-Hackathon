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
  const toast=useToast();
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [isStartingGame, setIsStartingGame] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);


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
      toast.open({
        message: {
          heading: "Insufficient Balance",
          content: "Please enter a valid bet amount.",
        },
        duration: 5000,
        position: "top-center",
        color: "warning",
      });
      return;
    }
    setIsPlacingBet(true);
    try {
      const receipt = await placeBet(betAmount, 0); // 0 = Plinko

      // Find the BetPlaced event log
      const log = receipt.logs.find(
        (log: any) =>
          log.topics[0].toLowerCase() === BET_PLACED_EVENT_SIGNATURE.toLowerCase()
      );

      if (!log) {
        toast.open({
          message: {
        heading: "Bet Event Missing",
        content: "⚠️ BetPlaced event not found in transaction logs.",
          },
          duration: 5000,
          position: "top-center",
          color: "error",
        });
        throw new Error("BetPlaced event not found in logs");
      }

      // Decode using Interface
      const iface = new ethers.Interface(CONTRACT_ABI);
      const decoded = iface.decodeEventLog("BetPlaced", log.data, log.topics);

      const sessionId = Number(decoded.sessionId);
      setSessionId(sessionId);

      console.log("✅ Bet placed with sessionId:", sessionId, "for amount of ", betAmount);
      toast.open({
        message: {
          heading: "Bet Placed",
          content: `Bet Amount: ${betAmount} ETH`,
        },
        duration: 5000,
        position: "top-center",
        color: "success",
      });
    } catch (error) {
     toast.open({
        message: {
          heading: "Bet Failed",
          content: "An error occurred while placing the bet.",
        },
        duration: 5000,
        position: "top-center",
        color: "error",
      });
    }finally {
      setIsPlacingBet(false);
    }
  };

  const startGame = async () => {
    if (sessionId === null) {
      toast.open({
        message: {
          heading: "No Session",
          content: "No session found. Please place a bet first.",
        },
        duration: 5000,
        position: "top-center",
        color: "warning",
      });
        return;
      }
      
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
      try {

      const { multiplier1, point } = await getGameResultPlinko(sessionId!);

      setMultiplier(multiplier1 / 10);

      const actualReward = betAmount * (multiplier1 / 10);
      setReward(actualReward);
      console.log("data:", multiplier1, point, "actualReward:", actualReward);

      if (ballManager) {
        console.log("finalIndex", point);

      const outcomePoints = outcomes[point.toString() as keyof typeof outcomes];
      if (outcomePoints && outcomePoints.length > 0) {
        const randomPoint = outcomePoints[Math.floor(Math.random() * outcomePoints.length)];
        ballManager.addBall(randomPoint);
      } else {
        console.error("No outcomes available for the given point:", point);
      }
      }
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
    }finally {
      setIsStartingGame(false);
    }
  };

  const handleWithdraw = async () => {
    if (sessionId === null) {
      toast.open({
        message: {
          heading: "No Session",
          content: "No session found. Please place a bet first.",
        },
        duration: 5000,
        position: "top-center",
        color: "warning",
      });
      return;
    }
    setIsWithdrawing(true);
    try {
      console.log("Starting withdrawal...");
      const { payout } = await withdrawWinnigs(sessionId);
      toast.open({
        message: {
          heading: "Withdrawal Successful",
          content: `You have withdrawn ${payout} ETH.`,
        },
        duration: 5000,
        position: "top-center",
        color: "success",
      });

      setReward(null);
      setMultiplier(null);
      setSessionId(null);
    } catch (error: any) {
      console.error("Withdraw failed:", error);

      const msg = error?.message?.toLowerCase() || "";

      if (msg.includes("already resolved")) {
        toast.open({
          message: {
        heading: "Session Resolved",
        content: "⚠️ This session has already been resolved.",
          },
          duration: 5000,
          position: "top-center",
          color: "warning",
        });
      } else if (msg.includes("invalid session")) {
        toast.open({
          message: {
        heading: "Invalid Session",
        content: "❌ Invalid session ID.",
          },
          duration: 5000,
          position: "top-center",
          color: "error",
        });
      } else if (msg.includes("transfer failed")) {
        toast.open({
          message: {
        heading: "Transfer Failed",
        content: "❌ ETH transfer failed. Try again later.",
          },
          duration: 5000,
          position: "top-center",
          color: "error",
        });
      } else if (msg.includes("withdrawal event not found")) {
        toast.open({
          message: {
        heading: "Withdrawal Event Missing",
        content: "⚠️ No withdrawal event found. Please check manually.",
          },
          duration: 5000,
          position: "top-center",
          color: "warning",
        });
      } else {
        toast.open({
          message: {
        heading: "Withdrawal Failed",
        content: "❌ Withdrawal failed.",
          },
          duration: 5000,
          position: "top-center",
          color: "error",
        });
      }
    }finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-500">
      <Header />
      <div className="flex flex-col lg:flex-row items-start justify-center px-8 gap-10">
        <div className="w-full max-w-sm space-y-6 bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-lg mt-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-center">Plinko Game</h2>

          <div>
            <Label className="text-sm mb-2 block">Bet Amount (ETH)</Label>
            <Input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(parseFloat(e.target.value) || 0)}
              placeholder="0.0001 ETH"
              className="mb-4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setBetAmount(betAmount * 0.5)} className="flex-1">
                /2
              </Button>
              <Button variant="secondary" onClick={() => setBetAmount(betAmount * 2)} className="flex-1">
                x2
              </Button>
            </div>
          </div>


            {sessionId !== null ? (
            <Button
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition rounded-md flex items-center justify-center"
              onClick={startGame}
              disabled={isStartingGame || isPlacingBet || isWithdrawing || false}
            >
              {isStartingGame ? (
              <>
                <ClipLoader size={20} color="#ffffff" />
                <span className="ml-2">Starting Game...</span>
              </>
              ) : (
              "Start Game"
              )}
            </Button>
            ) : (
            <Button
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition rounded-md flex items-center justify-center"
              onClick={handlePlaceBet}
              disabled={isPlacingBet || isStartingGame || isWithdrawing}
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

            <Button
            className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold transition rounded-md flex items-center justify-center"
            onClick={handleWithdraw}
            disabled={isWithdrawing || isPlacingBet || isStartingGame}
            >
            {isWithdrawing ? (
              <>
              <ClipLoader size={20} color="#ffffff" />
              <span className="ml-2">Withdrawing...</span>
              </>
            ) : (
              "Withdraw"
            )}
            </Button>

          {reward !== null && (
            <div
              className={`mt-6 p-4 rounded-lg text-center transition ${
                multiplier && multiplier > 10
                  ? "bg-green-500 dark:bg-green-600"
                  : multiplier === 10
                  ? "bg-yellow-500 dark:bg-yellow-600"
                  : "bg-red-500 dark:bg-red-600"
              }`}
            >
              <h3 className="text-xl font-bold">
                {multiplier && multiplier > 10
                  ? "Congratulations!"
                  : multiplier === 10
                  ? "Break Even"
                  : "Better Luck Next Time!"}
              </h3>
              <p className="text-sm mt-1">
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
    </div>
  );
}
