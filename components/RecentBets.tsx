import React, { useEffect, useState } from "react";
import { CircleDot } from "lucide-react";
import { useStakeGameFunctions } from "@/ContractFunctions/functions";
import { toScientificNotation } from "@/utils/scientificNotation";

interface Winner {
  username: string;
  game: string;
  amount: string;
  time: string;
  isWin: boolean;
  fullAddress: string;
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

const RecentBets: React.FC = () => {
  const [players, setPlayers] = useState<Winner[]>([]);
  const [onlyMyBets, setOnlyMyBets] = useState<boolean>(false);
  const { getAllSessions, address } = useStakeGameFunctions();

  useEffect(() => {
    const fetchSessions = async () => {
      if (address) {
        try {
          const sessions = (await getAllSessions()) ?? [];

          const allBets = sessions
            .sort((a: any, b: any) => b.timestamp - a.timestamp)
            .map((session: any) => ({
              isWin: session.isWin,
              username:
                session.player.slice(0, 6) + "..." + session.player.slice(-4),
              fullAddress: session.player,
              game: gameTypeToLabel(session.game),
              amount: `${toScientificNotation(session.betAmount, 2)} ETH`,
              time: `${Math.floor(
                (Date.now() / 1000 - session.timestamp) / 60
              )} min ago`,
            }));

          setPlayers(allBets);
        } catch (error) {
          console.error("Error fetching sessions:", error);
        }
      }
    };

    fetchSessions();
  }, [address, getAllSessions]);

  const filteredPlayers =
    onlyMyBets && address
      ? players.filter(
          (player) =>
            player.fullAddress.toLowerCase() === address.toLowerCase()
        )
      : players;
  const displayedPlayers = filteredPlayers.slice(0, 10);

  return (
    <div className="mt-8 w-[90%] mx-auto mb-10">
      <div className="p-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-800 dark:to-purple-800 shadow-2xl">
        <div className="w-full bg-gray-50 dark:bg-gray-900 p-8 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col items-center">
          <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900 dark:text-gray-100">
            Recent Bets on MetaBet
          </h2>
          {address ? (
            <>
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
              <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-md overflow-hidden">
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 text-left">
                        <th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Player
                        </th>
                        <th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Game
                        </th>
                        <th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Bet Amount
                        </th>
                        <th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedPlayers.map((player, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-200 dark:border-gray-700 transition-colors hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900 dark:hover:to-pink-900"
                        >
                          <td className="py-4 px-4 flex items-center text-gray-900 dark:text-white">
                            <CircleDot className="h-5 w-5 text-green-500 mr-2" />
                            <span className="font-medium">{player.username}</span>
                          </td>
                          <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                            {player.game}
                          </td>
                          <td
                            className={`py-4 px-4 font-bold ${
                              player.isWin
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {player.amount}
                          </td>
                          <td className="py-4 px-4 text-gray-500 dark:text-gray-400 text-sm">
                            {player.time}
                          </td>
                        </tr>
                      ))}
                      {displayedPlayers.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
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
            </>
          ) : (
            <div className="w-full px-6 py-8 mt-6 text-center text-gray-700 bg-indigo-50 border border-indigo-200 dark:bg-gray-700 dark:border-gray-600 rounded-lg shadow-sm dark:text-gray-300">
              <p className="text-lg font-medium">
                Wallet not connected. Please connect your wallet to see the recent bets.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentBets;
