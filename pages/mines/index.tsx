import React, { useState, useEffect } from "react";
import { Slider } from "antd";
import Header from "@/components/Header";
import { useStakeGameFunctions } from "@/ContractFunctions/functions";
import { ethers } from "ethers";

import { useToast } from "@/contexts/toast/toastContext";
import { PlaceBet, Withdraw } from "@/utils/helpers";
import { CONTRACT_ABI } from "@/lib/contract";
import GameGrid from "@/components/mines/gameGrid";
import Sidebar from "@/components/mines/SIdebar";
import { reset } from "viem/actions";
import BetHistory from "@/components/BetHistory";

type CellType = "mine" | "diamond" | "empty";

interface Cell {
  type: CellType;
  revealed: boolean;
}

const GRID_SIZE = 5;

const Home: React.FC = () => {
  const { placeBet, playMinesTile, getBalance, address, withdrawWinnigs } =
    useStakeGameFunctions();

  const [betAmount, setBetAmount] = useState<number>(0.001);
  const [numMines, setNumMines] = useState<number>(1);
  const [reward, setReward] = useState<number | null>(null);
  const [hasHitMine, setHasHitMine] = useState(false);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [multiplier, setMultiplier] = useState<number | null>(1);
  const [balance, setBalance] = useState<string>("0");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [withdrawableAmount, setWithdrawableAmount] = useState<number>(0);

  const toast = useToast();
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [isStartingGame, setIsStartingGame] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
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

  const handlePlaceBet = async () => {
    setIsPlacingBet(true);
    await PlaceBet(
      betAmount,
      placeBet,
      setSessionId,
      toast,
      CONTRACT_ABI,
      BET_PLACED_EVENT_SIGNATURE,
      2,
      numMines
    );
    setIsPlacingBet(false);

  };

  const generateGrid = (): void => {
    const newGrid: Cell[][] = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill({ type: "empty", revealed: false }));
    setGrid(newGrid);
  };

  const handleClick = async (row: number, col: number) => {
     setMultiplier((prev)=> prev!+ 0.5/(25-numMines));
    const { isWin, payout, multiplier, safeTilesFound } = await playMinesTile(
      sessionId!
    );
    console.log("Game result:", isWin, payout, multiplier, safeTilesFound);
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      const newRow = [...newGrid[row]];
      newRow[col] = {
        ...newRow[col],
        type: isWin ? "diamond" : "mine",
        revealed: true,
      };
      newGrid[row] = newRow;
      return newGrid;
    });
    setReward(payout);
   

    if (isWin) {
      setWithdrawableAmount((prev) => prev + payout);
    } else {
      toast.open({
        message: {
          heading: "Game Over",
          content: "You hit a mine! Better luck next time.",
        },
        duration: 5000,
        position: "top-center",
        color: "error",
      });
      setGameStarted(false);
      fetchBalance();
      setHasHitMine(true);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    generateGrid();
    console.log("Game started");
  };

  const handleWithdraw = async () => {
    await Withdraw(
      sessionId,
      withdrawWinnigs,
      setIsWithdrawing,
      setSessionId,
      toast
    );
    setMultiplier(1);
    setReward(null);
    setGrid([]);
    setGameStarted(false);
    setWithdrawableAmount(0);
    await fetchBalance();
  };
  const reset = () => {
    setGameStarted(false);
    setGrid([]);
    setMultiplier(1);
    setReward(null);
    setWithdrawableAmount(0);
    setHasHitMine(false);
    setSessionId(null);
    setBetAmount(0.001);
    setNumMines(1);
    setIsPlacingBet(false);
    setIsStartingGame(false);
    setIsWithdrawing(false);
    fetchBalance();
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="flex flex-col lg:flex-row  px-12 gap-4">
        {/* Sidebar */}
        <Sidebar
          balance={balance}
          betAmount={betAmount}
          setBetAmount={setBetAmount}
          numMines={numMines}
          setNumMines={setNumMines}
          multiplier={multiplier}
          sessionId={sessionId}
          isStartingGame={isStartingGame}
          isPlacingBet={isPlacingBet}
          isWithdrawing={isWithdrawing}
          gameStarted={gameStarted}
          startGame={startGame}
          handlePlaceBet={handlePlaceBet}
          handleWithdraw={handleWithdraw}
          withdrawableAmount={withdrawableAmount}
          hasPlayed={hasHitMine}
          resetGame={reset}
        />
        {/* Game Grid */}
        <GameGrid
          grid={grid}
          gameStarted={gameStarted}
          handleClick={handleClick}
        />
      </div>
      <div className="mt-8 w-[80%] bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center mx-auto flex-col mb-10">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
          Bet History
        </h2>
        <BetHistory gameType={2} />
      </div>
    </div>
  );
};

export default Home;
