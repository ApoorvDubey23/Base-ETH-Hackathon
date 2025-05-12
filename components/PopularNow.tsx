import React from 'react';
import Link from 'next/link';
import { Dices, CircleArrowRight } from "lucide-react";

const PopularNow: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-6 md:p-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
              <Dices className="h-5 w-5 text-green-600 dark:text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Now</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hot games players are enjoying right now on MetaBet
              </p>
            </div>
          </div>
          <span className="border border-yellow-500 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 px-3 py-1 rounded-md text-sm font-medium">
            TRENDING
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "Plinko",
              description: "Drop the ball and watch it bounce for huge multipliers.",
              color: "blue",
              players: "4,562",
              href: "/plinko",
            },
            {
              name: "Limbo",
              description: "How high will the multiplier climb? Test your luck.",
              color: "yellow",
              players: "3,271",
              href: "/limbo",
            },
            {
              name: "Dice",
              description: "Predict your rolls and win big in this classic dice game.",
              color: "purple",
              players: "2,809",
              href: "/dice",
            },
            {
              name: "Mines",
              description: "Navigate through a minefield to uncover gems and multipliers.",
              color: "red",
              players: "3,125",
              href: "/mines",
            },
          ].map((game, index) => (
            <div
              key={index}
              className={`rounded-lg border border-${game.color}-200 dark:border-${game.color}-500/20 bg-${game.color}-50 dark:bg-${game.color}-500/10 p-6 shadow-md`}
            >
              <div
                className={`h-12 w-12 rounded-lg bg-${game.color}-100 dark:bg-${game.color}-500/20 flex items-center justify-center mb-4`}
              >
                <span className={`text-2xl font-bold text-${game.color}-600 dark:text-${game.color}-400`}>
                  {game.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{game.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{game.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="text-green-600 dark:text-green-400">{game.players}</span> playing now
                </div>
                <Link
                  href={game.href}
                  className={`text-${game.color}-600 dark:text-${game.color}-400 hover:text-${game.color}-500 dark:hover:text-${game.color}-300 flex items-center text-sm font-medium`}
                >
                  Play <CircleArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularNow;
