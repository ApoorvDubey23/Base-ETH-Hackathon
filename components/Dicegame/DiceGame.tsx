import React, { useEffect, useState } from "react";
import DiceDisplay from "./diceDisplay";
import BetControls from "./betControls";
import GameHistory, { GameResult } from "./gameHistory";
import GameStats from "./gameStats";
import PredictionSelector from "./predictionStats";
import { useStakeGameFunctions } from "@/ContractFunctions/functions";
import { ethers } from "ethers";
import { PlaceBet, Withdraw } from "@/utils/helpers";
import { CONTRACT_ABI } from "@/lib/contract";
import { useToast } from "@/contexts/toast/toastContext";

const DiceGame: React.FC = () => {
  const {
    placeBet,
    getGameResultDice,
    getBalance,
    address,
    getSigner,
    withdrawWinnigs,
  } = useStakeGameFunctions();

  const [balance, setBalance] = useState(1000);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [betAmount, setBetAmount] = useState(0.0001);
  const [prediction, setPrediction] = useState<"under" | "over">("under");
  const [selectedValue, setSelectedValue] = useState<1 | 2 | 3 | 4 | 5 | 6>(4);
  const [diceValue, setDiceValue] = useState<number>(1);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [totalBets, setTotalBets] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [profit, setProfit] = useState(0);
  const [cashoutAvailable, setCashoutAvailable] = useState(false);
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const toast = useToast();
  useEffect(() => {
    const fetchBalance = async () => {
      if (address) {
        const balancevar = await getBalance();
        setBalance(parseFloat(balancevar));
        console.log("Balance:", balancevar);
      }
    };
    fetchBalance();
  }, [address]);

  const BET_PLACED_EVENT_SIGNATURE = ethers.id(
    "BetPlaced(uint256,address,uint8,uint256)"
  );

  const handlePlaceBet = async () => {
    await PlaceBet(
      betAmount,
      placeBet,
      setIsPlacingBet,
      setSessionId,
      toast,
      CONTRACT_ABI,
      BET_PLACED_EVENT_SIGNATURE,
      1,
      selectedValue,
      prediction === "over"
    );
  };

  const rollDice = async () => {
    if (betAmount <= 0) {
      toast.open({
        message: {
          heading: "Invalid Bet Amount",
          content: "Please enter a valid bet amount.",
        },
        duration: 5000,
        position: "top-center",
        color: "warning",
      });
      return;
    }

    if (betAmount > balance) {
      toast.open({
        message: {
          heading: "Insufficient Balance",
          content: "You do not have enough balance to place this bet.",
        },
        duration: 5000,
        position: "top-center",
        color: "warning",
      });
      return;
    }

    setIsRolling(true);
    setCashoutAvailable(true);
    setBalance((prev) => prev - betAmount);
    setProfit((prev) => prev - betAmount);

    const rollDuration = 1500;
    const startTime = Date.now();
    const rollInterval = setInterval(() => {
      const randomValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(randomValue);
      if (Date.now() - startTime > rollDuration) {
        clearInterval(rollInterval);
        finalizeRoll();
      }
    }, 100);
    setHasPlayed(true);
  };

  const finalizeRoll = async () => {
    const { isWin, payout, outcome } = await getGameResultDice(sessionId!);
    console.log("Game Result:", isWin, payout, outcome);
    setDiceValue(outcome);

    setTimeout(() => {
      updateGameStats(isWin, payout);
      addToGameHistory(outcome, payout);
      setIsRolling(false);
    }, 500);
  };

  const cashout = async () => {
    if (!cashoutAvailable) {
      toast.open({
        message: {
          heading: "Cashout Unavailable",
          content: "You can only cash out during the rolling phase.",
        },
        duration: 5000,
        position: "top-center",
        color: "error",
      });
      return;
    }

    await Withdraw(
      sessionId!,
      withdrawWinnigs,
      setIsWithdrawing,
      setSessionId,
      toast
    );

    const updatedBalance = await getBalance();
    setBalance(parseFloat(updatedBalance));

    setCashoutAvailable(false);
    setIsRolling(false);

    toast.open({
      message: {
        heading: "Cashout Successful",
        content: "You cashed out!",
      },
      duration: 5000,
      position: "top-center",
      color: "success",
    });
    setSessionId(null);
    setHasPlayed(false);
  };

  const updateGameStats =async (isWin: boolean, payout: number) => {
    const updatedBalance = await getBalance();
    setBalance(parseFloat(updatedBalance));
    if (isWin) {
      setTotalWins((prev) => prev + 1);
      toast.open({
        message: {
          heading: "You Won!",
          content: `You won ${payout}!`,
        },
        duration: 5000,
        position: "top-center",
        color: "success",
      });
    } else {
      toast.open({
        message: {
          heading: "You Lost!",
          content: `You lost ${betAmount}!`,
        },
        duration: 5000,
        position: "top-center",
        color: "error",
      });
    }

    setTotalBets((prev) => prev + 1);
    setProfit((prev) => (isWin ? prev + payout - betAmount : prev - betAmount));
  };

  const addToGameHistory = (diceValue: number, payout: number) => {
    const historyItem: GameResult = {
      id: Date.now(),
      diceValue,
      prediction,
      predictedValue: selectedValue,
      betAmount,
      payout,
      timestamp: new Date(),
    };

    setGameHistory((prev) => [historyItem, ...prev.slice(0, 19)]);
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
            sessionId={sessionId}
            handlePlaceBet={handlePlaceBet}
            isPlacingBet={isPlacingBet}
            hasPlayed={hasPlayed}
          />
          {cashoutAvailable && (
            <button
              onClick={cashout}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
            >
              Cashout
            </button>
          )}
        </div>
        <div>
          <GameHistory history={gameHistory} />
        </div>
      </div>
    </div>
  );
};

export default DiceGame;
