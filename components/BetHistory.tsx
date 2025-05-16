"use client";
import React from "react";
import { useBetHistory } from "@/utils/useBetHistory";
import { toScientificNotation } from "@/utils/scientificNotation";

interface BetHistoryProps {
  gameType?: number; // 0: Plinko, 1: Dice, 2: Mines; if omitted, show all.
}

const gameTypeToLabel = (type: number): string => {
  switch (type) {
    case 0:
      return "Plinko";
    case 1:
      return "Dice";
    case 2:
      return "Mines";
    default:
      return "Unknown";
  }
};

const BetHistory: React.FC<BetHistoryProps> = ({ gameType }) => {
  const { betHistory, loading, error } = useBetHistory(gameType);

  if (loading) {
    return <div>Loading bet history...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (betHistory.length === 0) {
    return <div>No bet history found.</div>;
  }

  const totalBets = betHistory.length;
  const totalProfit = betHistory.reduce((acc, session) => acc + (session.payout - session.betAmount), 0);

  return (
    <div className="mt-8 w-[90%] bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center mx-auto flex-col mb-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
        Bet History
      </h2>

      <div className="flex justify-between w-full mb-4 px-6">
        <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Total Bets: {totalBets}
        </div>
        <div
          className={`text-lg font-medium ${
            totalProfit >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {totalProfit >= 0 ? "Profit: " : "Loss: "}
          {toScientificNotation(Math.abs(totalProfit))} ETH
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-md overflow-hidden w-full">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                <th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Session ID
                </th>
                <th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Game
                </th>
                <th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bet Amount
                </th>
                <th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Result
                </th>
                <th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Payout
                </th>
                <th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {betHistory.map((session) => (
                <tr
                  key={session.sessionId}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="py-4 px-4 text-gray-900 dark:text-white">
                    {session.sessionId}
                  </td>
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                    {gameTypeToLabel(session.game)}
                  </td>
                  <td className="py-4 px-4 font-medium text-yellow-500">
                    {toScientificNotation(session.betAmount)} ETH
                  </td>
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                    {session.isWin ? "Win" : "Loss"}
                  </td>
                  <td className="py-4 px-4 font-medium text-green-500">
                    {toScientificNotation(session.payout)} ETH
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(session.timestamp * 1000).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BetHistory;
