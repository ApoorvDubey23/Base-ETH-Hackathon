import React from "react";

type CellType = "mine" | "diamond" | "empty";

interface Cell {
  type: CellType;
  revealed: boolean;
}

interface GameGridProps {
  grid: Cell[][];
  gameStarted: boolean;
  handleClick: (row: number, col: number) => void;
}

const GameGrid: React.FC<GameGridProps> = ({ grid, gameStarted, handleClick }) => {
  if (!gameStarted && grid.length === 0) {
    return (
      <div className="rounded-lg flex items-center justify-center mt-6 py-2 bg-gray-50 dark:bg-gray-800 h-[90vh] w-full">
        <span className="text-3xl font-semibold text-gray-800 dark:text-gray-100 capitalize">
          place a bet and start the game
        </span>
      </div>
    );
  }
  
  return (
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
  );
};

export default GameGrid;
