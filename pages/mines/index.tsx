import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Slider } from "antd";
import Navbar from "./NavBar";

type CellType = "mine" | "diamond" | "empty";

interface Cell {
    type: CellType;
    revealed: boolean;
}

const GRID_SIZE = 5;

const Home: React.FC = () => {
    // State declarations
    const [address, setAddress] = useState<string | null>(null);
    const [betAmount, setBetAmount] = useState<number>(1);
    const [numMines, setNumMines] = useState<number>(1);
    const [grid, setGrid] = useState<Cell[][]>([]);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [multiplier, setMultiplier] = useState<number>(100000000);

    // Set up grid as a dummy 5x5 array on mount (or when game starts)
    const generateGrid = (): void => {
        const newGrid: Cell[][] = Array(GRID_SIZE)
            .fill(null)
            .map(() => Array(GRID_SIZE).fill({ type: "empty", revealed: false }));
        setGrid(newGrid);
    };

    // Initialize address from sessionStorage (client-side only)
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedAddress = window.sessionStorage.getItem("address");
            setAddress(storedAddress);
        }
    }, []);

    // Input handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setBetAmount(isNaN(value) ? 0 : value);
    };

    const handleSliderChange = (value: number) => {
        setBetAmount(value);
    };

    const increaseMines = () => {
        setNumMines((prev) => Math.min(prev + 1, 25));
    };

    const decreaseMines = () => {
        setNumMines((prev) => Math.max(prev - 1, 1));
    };

    // Dummy game functions
    const handleClick = (row: number, col: number) => {
        console.log(`Clicked cell at ${row}, ${col}`);
        // Update grid state based on game logic.
    };

    const StartGame = () => {
        setGameStarted(true);
        generateGrid();
        console.log("Game started");
    };

    const cashOut = () => {
        setGameStarted(false);
        console.log("Cashed out");
    };

    const formattedAddress = address
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : "Not Connected";

    return (
<div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800">

<Navbar
        Token={null} // Replace with actual token value or state
        settoken={() => {}} // Replace with actual setter function
        network={null} // Replace with actual network value or state
        setNetwork={() => {}} // Replace with actual setter function
        Address={address} // Use the existing 'address' state
        setAddress={setAddress} // Use the existing 'setAddress' state setter
      />
        <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col justify-center items-center lg:flex-row p-6 px-12 gap-4">
            <Toaster />
            {/* Sidebar */}
            <div className="bg-gray-800 flex flex-col items-center justify-center py-4 px-4 h-[90vh] rounded-lg shadow-lg lg:w-1/4 space-y-5 lg:mb-0">
                {/* Player Address Display */}
                <div className="flex flex-col gap-2 w-full bg-gray-900 px-4 py-6 h-1/5 justify-center rounded-lg font-semibold shadow-md">
                    <div className="text-2xl text-gray-400">Player Address</div>
                    <div className="text-lg text-yellow-400">
                        {formattedAddress}
                    </div>
                </div>
                {/* Bet Amount */}
                <div className="flex flex-col justify-center w-full gap-2 px-4 py-16 space-y-2 font-semibold bg-gray-900 rounded-lg shadow-md h-1/5">
                    <span className="block text-2xl text-gray-400">Bet Amount</span>
                    <div className="flex items-center justify-between space-x-2">
                        <button
                            onClick={() => setBetAmount(1)}
                            className="px-4 py-1 text-white bg-gray-700 rounded-lg"
                        >
                            Min
                        </button>
                        <input
                            type="number"
                            value={betAmount}
                            onChange={handleInputChange}
                            className="w-full py-1 text-sm text-center text-yellow-400 bg-gray-900 border-2 border-gray-700 rounded-lg"
                        />
                        <button
                            onClick={() => setBetAmount(100)}
                            className="px-4 py-1 text-white bg-gray-700 rounded-lg"
                        >
                            Max
                        </button>
                    </div>
                    <Slider
                        min={1}
                        max={100}
                        value={betAmount}
                        onChange={handleSliderChange}
                        className="w-full custom-slider"
                    />
                </div>
                {/* Mines Selector */}
                <div className="flex flex-col justify-center w-full gap-2 px-4 py-16 space-y-2 font-semibold bg-gray-900 rounded-lg shadow-md h-1/5">
                    <span className="block text-2xl text-gray-400">Mines</span>
                    <div className="flex items-center justify-between space-x-2">
                        <button
                            onClick={decreaseMines}
                            className="px-4 py-2 text-white bg-gray-700 rounded-lg"
                        >
                            -
                        </button>
                        <input
                            type="text"
                            value={numMines}
                            readOnly
                            className="w-full py-2 text-center text-yellow-400 bg-gray-900 border-2 border-gray-700 rounded-lg"
                        />
                        <button
                            onClick={increaseMines}
                            className="px-4 py-2 text-white bg-gray-700 rounded-lg"
                        >
                            +
                        </button>
                    </div>
                </div>
                {/* Score and Multiplier */}
                <div className="flex flex-col justify-center w-full gap-2 px-4 py-16 space-y-2 font-semibold bg-gray-900 rounded-lg shadow-md h-1/5">
                    <span className="block text-2xl text-gray-400">Multiplier</span>
                    <span className="flex items-center justify-center text-5xl font-bold text-yellow-300">
                        x{(multiplier / 100000000).toFixed(2)}
                    </span>
                </div>
                {/* Start Game / Cash Out Button */}
                <button
                    onClick={gameStarted ? cashOut : StartGame}
                    className="w-full py-3 text-lg font-semibold text-white transition-transform rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 hover:scale-105"
                >
                    {gameStarted ? "Cash Out" : "Place Bet & Start Game"}
                </button>
            </div>
            {/* Game Grid */}
            <div className="h-[90vh] rounded-lg lg:w-3/4 flex items-center justify-center mt-6 py-2 lg:mt-0 bg-gray-800 relative">
                <div
                    className={`grid grid-cols-5 w-full h-full items-center lg:pl-[6vw] ${!gameStarted ? "pointer-events-none" : ""
                        }`}
                >
                    {grid.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                onClick={() => handleClick(rowIndex, colIndex)}
                                className={`aspect-square w-[7vw] h-[7vw] rounded-lg border border-neutral-700 flex justify-center items-center cursor-pointer transform transition-transform ${cell.revealed
                                        ? cell.type === "mine"
                                            ? "bg-red-600 border-red-500"
                                            : cell.type === "diamond"
                                                ? "bg-green-700 border-green-600"
                                                : "bg-gray-600 border-gray-500"
                                        : "bg-gradient-to-br from-gray-600 to-gray-800 shadow-lg hover:scale-105"
                                    }`}
                                style={{
                                    boxShadow: cell.revealed
                                        ? "none"
                                        : "0px 4px 10px rgba(0, 0, 0, 0.3)",
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
                                    <span className="text-4xl font-semibold text-gray-400 transition-colors duration-300 ease-in-out hover:text-black">
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