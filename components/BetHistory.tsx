"use client";
import React, { useState } from "react";
import { useBetHistory } from "@/utils/useBetHistory";
import { toScientificNotation } from "@/utils/scientificNotation";
import { useStakeGameFunctions } from "@/ContractFunctions/functions";
import { CircleDot } from "lucide-react";

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
  const { address } = useStakeGameFunctions();

  const [onlyMyBets, setOnlyMyBets] = useState(false);

  if (loading) return <div>Loading bet history...</div>;
  if (error) return <div>Error: {error}</div>;
  if (betHistory.length === 0) return <div>No bet history found.</div>;

  const filteredHistory = onlyMyBets && address
    ? betHistory.filter(
        (session) =>
          session.player.toLowerCase() === address.toLowerCase()
      )
    : betHistory;

  const totalBets = filteredHistory.length;
  const totalProfit = filteredHistory.reduce(
    (acc, session) => acc + (session.payout - session.betAmount),
    0
  );

  return (
    <div className="mt-8 w-[90%] mx-auto mb-10">
      <div className="p-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-800 dark:to-purple-800 shadow-2xl">
        <div className="w-full bg-gray-50 dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center">
          <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900 dark:text-gray-100">
            Bet History
          </h2>

          {address && (
            <div className="flex items-center mb-6 w-full px-6">
              <input
                type="checkbox"
                id="myBets"
                checked={onlyMyBets}
                onChange={() => setOnlyMyBets(!onlyMyBets)}
                className="mr-3 h-5 w-5 accent-indigo-600 dark:accent-purple-400"
              />
              <label
                htmlFor="myBets"
                className="text-lg text-gray-700 dark:text-gray-300"
              >
                Show My Bets
              </label>
            </div>
          )}

          <div className="flex justify-between w-full mb-6 px-6">
            <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Total Bets: {totalBets}
            </div>
            <div
              className={`text-xl font-semibold ${
                totalProfit >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {totalProfit >= 0 ? "Profit: " : "Loss: "}
              {toScientificNotation(Math.abs(totalProfit))} ETH
            </div>
          </div>

          <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 text-left">
                    <th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {onlyMyBets ? "Session ID" : "Player Address"}
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
                  {filteredHistory.map((session) => (
                    <tr
                      key={session.sessionId}
                      className="border-b border-gray-200 dark:border-gray-700 last:border-0 transition-colors hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900 dark:hover:to-pink-900"
                    >
                      <td className="py-4 px-4 text-gray-900 dark:text-white">
                        {onlyMyBets
                          ? session.sessionId
                          : session.player.slice(0, 6) +
                            "..." +
                            session.player.slice(-4)}
                      </td>
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                        {gameTypeToLabel(session.game)}
                      </td>
                      <td className="py-4 px-4 font-bold text-yellow-500">
                        {toScientificNotation(session.betAmount)} ETH
                      </td>
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                        {session.isWin ? "Win" : "Loss"}
                      </td>
                      <td className="py-4 px-4 font-bold text-green-500">
                        {toScientificNotation(session.payout)} ETH
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(session.timestamp * 1000).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {filteredHistory.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-4 px-4 text-center text-gray-500 dark:text-gray-400"
                      >
                        No bets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetHistory;
