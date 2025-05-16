import React, { useState, useEffect } from "react";
import { Slider } from "antd";
import Header from "@/components/Header";
import { useStakeGameFunctions } from "@/ContractFunctions/functions";
import { ethers } from "ethers";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/toast/toastContext";
import { PlaceBet, Withdraw } from "@/utils/helpers";
import { CONTRACT_ABI } from "@/lib/contract";

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
        await PlaceBet(
            betAmount,
            placeBet,
            setIsPlacingBet,
            setSessionId,
            toast,
            CONTRACT_ABI,
            BET_PLACED_EVENT_SIGNATURE,
            2,
            numMines
        );
    };

    // Set up grid as a dummy 5x5 array on mount (or when game starts)
    const generateGrid = (): void => {
        const newGrid: Cell[][] = Array(GRID_SIZE)
            .fill(null)
            .map(() => Array(GRID_SIZE).fill({ type: "empty", revealed: false }));
        setGrid(newGrid);
    };

    // Input handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setBetAmount(isNaN(value) ? 0 : value);
    };

    const increaseMines = () => {
        setNumMines((prev) => Math.min(prev + 1, 25));
    };

    const decreaseMines = () => {
        setNumMines((prev) => Math.max(prev - 1, 1));
    };

    // Dummy game functions
    const handleClick = async (row: number, col: number) => {
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
        setMultiplier(multiplier);

        if (isWin) {
            // accumulate winnings on safe move
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
            // Reset game state but keep withdrawableAmount intact if desired
            setGameStarted(false);
            setSessionId(null);
            setGrid([]);
            fetchBalance();
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
            <Header />
            <div className="flex flex-col lg:flex-row p-6 px-12 gap-4">
                {/* Sidebar */}
                <div className="bg-white dark:bg-gray-800 flex flex-col items-center justify-center py-4 px-4 h-[90vh] rounded-lg shadow-lg lg:w-1/4 space-y-5">
                    {/* Player Address Display */}
                    <div className="w-full bg-gray-50 dark:bg-gray-900 px-4 py-6 h-1/5 flex flex-col justify-center rounded-lg font-semibold shadow-md">
                        <div className="text-2xl text-gray-500 dark:text-gray-300">
                            Balance
                        </div>
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
                            Current Multiplier
                        </span>
                        <span className="flex items-center justify-center text-5xl font-bold text-indigo-600 dark:text-indigo-300">
                            x{multiplier!.toFixed(2)}
                        </span>
                    </div>
                    {sessionId !== null ? (
                        <Button
                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition rounded-md flex items-center justify-center"
                            onClick={startGame}
                            disabled={
                                isStartingGame || isPlacingBet || isWithdrawing || gameStarted
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
                                Withdraw {withdrawableAmount > 0 ? `(${withdrawableAmount})` : ""}
                            </span>
                        )}
                    </Button>
                </div>
                {/* Game Grid */}
                <div className="rounded-lg lg:w-3/4 flex items-center justify-center mt-6 py-2 lg:mt-0 bg-gray-50 dark:bg-gray-800 relative h-[90vh]">
                    <div
                        className={`grid grid-cols-5 w-full h-full items-center lg:pl-[6vw] ${
                            !gameStarted ? "pointer-events-none opacity-50" : ""
                        }`}
                    >
                        {grid.map((row, rowIndex) =>
                            row.map((cell, colIndex) => (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    onClick={() => handleClick(rowIndex, colIndex)}
                                    className={`aspect-square w-[7vw] h-[7vw] rounded-lg border flex justify-center items-center cursor-pointer transform transition-transform 
                                                                                ${
                                                                                    cell.revealed
                                                                                        ? cell.type === "mine"
                                                                                            ? "bg-red-500 border-red-400"
                                                                                            : cell.type === "diamond"
                                                                                            ? "bg-green-500 border-green-400"
                                                                                            : "bg-gray-300 dark:bg-gray-600 border-gray-400 dark:border-gray-500"
                                                                                        : "bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 shadow-lg hover:scale-105"
                                                                                }`}
                                    style={{
                                        boxShadow: cell.revealed
                                            ? "none"
                                            : "0px 4px 10px rgba(0, 0, 0, 0.15)",
                                    }}
                                >
                                    {cell.revealed ? (
                                        <span className="text-3xl">
                                            {cell.type === "mine"
                                                ? "💣"
                                                : cell.type === "diamond"
                                                ? "💎"
                                                : ""}
                                        </span>
                                    ) : (
                                        <span className="text-4xl font-semibold text-gray-500 dark:text-gray-300 transition-colors duration-300 ease-in-out hover:text-gray-700 dark:hover:text-gray-100">
                                            ?
                                        </span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
