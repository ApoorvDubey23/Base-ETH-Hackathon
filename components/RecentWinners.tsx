import React, { useEffect, useState } from 'react';
import { CircleDot } from "lucide-react";
import { useStakeGameFunctions } from '@/ContractFunctions/functions';
import { toScientificNotation } from '@/utils/scientificNotation'; // Import the function

interface Winner {
  username: string;
  game: string;
  amount: string;
  time: string;
}

const gameTypeToLabel = (type: number): string => {
  switch (type) {
    case 0: return 'Plinko';
    case 1: return 'Dice';
    case 2: return 'Mines';
    default: return 'Unknown';
  }
};

const RecentPlayers: React.FC = () => {
  const [players, setPlayers] = useState<Winner[]>([]);
  const { getAllSessions } = useStakeGameFunctions();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const sessions = (await getAllSessions()) ?? []; // Ensure sessions is an array

        const recentPlayers = sessions
          .map((session: any) => ({
            username: session.player.slice(0, 6) + '...' + session.player.slice(-4),
            game: gameTypeToLabel(session.game),
            amount: `${toScientificNotation(session.betAmount, 2)} ETH`, // Use the function here
            time: `${Math.floor((Date.now() / 1000 - session.timestamp) / 60)} min ago`,
          }))
          .slice(0, 10); // Get the most recent 10 sessions

        setPlayers(recentPlayers);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, [getAllSessions]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Recent Players on MetaBet
      </h2>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 shadow-md overflow-hidden">
        <div className="max-h-[300px] overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                <th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Player</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Game</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Bet Amount</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">Time</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="py-4 px-4 flex items-center">
                    <CircleDot className="h-4 w-4 text-green-500 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white">{player.username}</span>
                  </td>
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{player.game}</td>
                  <td className="py-4 px-4 font-medium text-yellow-500">{player.amount}</td>
                  <td className="py-4 px-4 text-gray-500 dark:text-gray-400 text-sm">{player.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentPlayers;
