
import React from 'react';
import { CircleDot } from "lucide-react";

interface Winner {
  username: string;
  game: string;
  amount: string;
  time: string;
}

const RecentWinners: React.FC = () => {
  const winners: Winner[] = [
    { username: "CryptoKing", game: "Plinko", amount: "$1,456", time: "Just now" },
    { username: "LuckyDragon", game: "Limbo", amount: "$890", time: "2 min ago" },
    { username: "DiamondHands", game: "Dice", amount: "$2,130", time: "5 min ago" },
    { username: "MoonWalker", game: "Plinko", amount: "$675", time: "10 min ago" },
    { username: "StarGazer", game: "Dice", amount: "$1,250", time: "15 min ago" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Recent Winners</h2>
      
      <div className="casino-card overflow-hidden">
        <div className="max-h-[300px] overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-black/30 text-left">
                <th className="py-3 px-4 text-sm font-medium text-gray-300">Player</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-300">Game</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-300">Amount</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-300">Time</th>
              </tr>
            </thead>
            <tbody>
              {winners.map((winner, index) => (
                <tr 
                  key={index}
                  className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                >
                  <td className="py-4 px-4 flex items-center">
                    <CircleDot className="h-4 w-4 text-casino-green mr-2" />
                    <span className="font-medium text-white">{winner.username}</span>
                  </td>
                  <td className="py-4 px-4 text-gray-300">{winner.game}</td>
                  <td className="py-4 px-4 font-medium text-casino-gold">{winner.amount}</td>
                  <td className="py-4 px-4 text-gray-400 text-sm">{winner.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentWinners;
