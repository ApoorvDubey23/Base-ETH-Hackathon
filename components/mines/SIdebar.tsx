import React from "react";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { reset } from "viem/actions";
import { toScientificNotation } from "@/utils/scientificNotation";

interface SidebarProps {
  balance: string;
  betAmount: number;
  setBetAmount: (amount: number) => void;
  numMines: number;
  setNumMines: (mines: number | ((prev: number) => number)) => void;
  multiplier: number | null;
  sessionId: number | null;
  isStartingGame: boolean;
  isPlacingBet: boolean;
  isWithdrawing: boolean;
  gameStarted: boolean;
  startGame: () => void;
  handlePlaceBet: () => void;
  handleWithdraw: () => void;
  withdrawableAmount: number;
  hasPlayed?: boolean;
  resetGame: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  balance,
  betAmount,
  setBetAmount,
  numMines,
  setNumMines,
  multiplier,
  sessionId,
  isStartingGame,
  isPlacingBet,
  isWithdrawing,
  gameStarted,
  startGame,
  handlePlaceBet,
  handleWithdraw,
  withdrawableAmount,
    hasPlayed,
    resetGame,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setBetAmount(isNaN(value) ? 0 : value);
  };

  const increaseMines = () => {
    setNumMines((prev: number) => Math.min(prev + 1, 25));
  };

  const decreaseMines = () => {
    setNumMines((prev: number) => Math.max(prev - 1, 1));
  };

  return (
    <div className="bg-white dark:bg-gray-800 flex flex-col items-center justify-center py-4 px-4 h-[90vh] rounded-lg shadow-lg lg:w-1/4 space-y-5">
      {/* Player Address Display */}
      <div className="w-full bg-gray-50 dark:bg-gray-900 px-4 py-6 h-1/5 flex flex-col justify-center rounded-lg font-semibold shadow-md">
        <div className="text-2xl text-gray-500 dark:text-gray-300">Balance</div>
        <div className="text-lg text-indigo-600 dark:text-yellow-400">
          {balance}
        </div>
      </div>
      {/* Bet Amount */}
      <div className="flex flex-col justify-center w-full gap-2 px-4 py-16 space-y-2 font-semibold bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md h-1/5">
        <span className="block text-2xl text-gray-500 dark:text-gray-300">
          Bet Amount
        </span>
        <div className="flex items-center justify-between space-x-2">
          <button
            onClick={() => setBetAmount(betAmount / 2)}
            className="px-4 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
          >
            1/2x
          </button>
          <input
            type="number"
            value={betAmount}
            onChange={handleInputChange}
            className="w-full py-1 text-sm text-center text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
            step="any"
          />
          <button
            onClick={() => setBetAmount(betAmount * 2)}
            className="px-4 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
          >
            2x
          </button>
        </div>
      </div>
      {/* Mines Selector */}
      <div className="flex flex-col justify-center w-full gap-2 px-4 py-16 space-y-2 font-semibold bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md h-1/5">
        <span className="block text-2xl text-gray-500 dark:text-gray-300">
          Mines
        </span>
        <div className="flex items-center justify-between space-x-2">
          <button
            onClick={decreaseMines}
            className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
          >
            -
          </button>
          <input
            type="text"
            value={numMines}
            readOnly
            className="w-full py-2 text-center text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
          />
          <button
            onClick={increaseMines}
            className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
          >
            +
          </button>
        </div>
      </div>
      {/* Multiplier Display */}
      <div className="flex flex-col justify-center w-full gap-2 px-4 py-16 space-y-2 font-semibold bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md h-1/5">
        <span className="block text-2xl text-gray-500 dark:text-gray-300">
          Reward Per Tile Revealed
        </span>
        <span className="flex items-center justify-center text-3xl font-bold text-indigo-600 dark:text-indigo-300">
          {toScientificNotation(((0.5 / (25-numMines))*betAmount))} ETH
        </span>
      </div>
      {sessionId !== null ? (
        <Button
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition rounded-md flex items-center justify-center"
          onClick={startGame}
          disabled={
            isStartingGame || isPlacingBet || isWithdrawing || gameStarted||hasPlayed
          }
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
     {
        !hasPlayed ? (
             <Button
        className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold transition rounded-md flex items-center justify-center"
        onClick={handleWithdraw}
        disabled={
          isWithdrawing || isPlacingBet || isStartingGame || !gameStarted
        }
      >
        {isWithdrawing ? (
          <>
            <ClipLoader size={20} color="#ffffff" />
            <span className="ml-2">Withdrawing...</span>
          </>
        ) : (
          <span>
            Withdraw{" "}
            {withdrawableAmount > 0 ? `(${withdrawableAmount})` : ""}
          </span>
        )}
      </Button>
        ) :(
            <Button
                className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold transition rounded-md flex items-center justify-center"
                onClick={() => {
                   resetGame();
                }}
                disabled={isStartingGame || isPlacingBet || isWithdrawing}
            >
                Reset Game
            </Button>
        )
      }


    </div>
  );
};

export default Sidebar;