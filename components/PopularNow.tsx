import React from 'react';
import Link from 'next/link';
import { Dices, CircleArrowRight } from "lucide-react";

const colorClasses: Record<string, {
  border: string;
  darkBorder: string;
  bg: string;
  darkBg: string;
  iconBg: string;
  iconDarkBg: string;
  iconText: string;
  iconDarkText: string;
  linkText: string;
  linkDarkText: string;
  linkHover: string;
  linkDarkHover: string;
}> = {
  blue: {
    border: "border-blue-300",
    darkBorder: "dark:border-blue-600/30",
    bg: "bg-blue-50",
    darkBg: "dark:bg-blue-900",
    iconBg: "bg-blue-100",
    iconDarkBg: "dark:bg-blue-800",
    iconText: "text-blue-700",
    iconDarkText: "dark:text-blue-300",
    linkText: "text-blue-600",
    linkDarkText: "dark:text-blue-400",
    linkHover: "hover:text-blue-500",
    linkDarkHover: "dark:hover:text-blue-300",
  },
  yellow: {
    border: "border-yellow-300",
    darkBorder: "dark:border-yellow-600/30",
    bg: "bg-yellow-50",
    darkBg: "dark:bg-yellow-900",
    iconBg: "bg-yellow-100",
    iconDarkBg: "dark:bg-yellow-800",
    iconText: "text-yellow-700",
    iconDarkText: "dark:text-yellow-300",
    linkText: "text-yellow-600",
    linkDarkText: "dark:text-yellow-400",
    linkHover: "hover:text-yellow-500",
    linkDarkHover: "dark:hover:text-yellow-300",
  },
  purple: {
    border: "border-purple-300",
    darkBorder: "dark:border-purple-600/30",
    bg: "bg-purple-50",
    darkBg: "dark:bg-purple-900",
    iconBg: "bg-purple-100",
    iconDarkBg: "dark:bg-purple-800",
    iconText: "text-purple-700",
    iconDarkText: "dark:text-purple-300",
    linkText: "text-purple-600",
    linkDarkText: "dark:text-purple-400",
    linkHover: "hover:text-purple-500",
    linkDarkHover: "dark:hover:text-purple-300",
  },
  red: {
    border: "border-red-300",
    darkBorder: "dark:border-red-600/30",
    bg: "bg-red-50",
    darkBg: "dark:bg-red-900",
    iconBg: "bg-red-100",
    iconDarkBg: "dark:bg-red-800",
    iconText: "text-red-700",
    iconDarkText: "dark:text-red-300",
    linkText: "text-red-600",
    linkDarkText: "dark:text-red-400",
    linkHover: "hover:text-red-500",
    linkDarkHover: "dark:hover:text-red-300",
  },
};

const games = [
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
];

const PopularNow: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="rounded-xl border border-gray-300 dark:border-gray-600 bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-green-200 dark:bg-green-700 flex items-center justify-center shadow-md">
              <Dices className="h-6 w-6 text-green-700 dark:text-green-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Popular Now</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Hot games players are enjoying right now on MetaBet
              </p>
            </div>
          </div>
          <span className="border border-yellow-500 bg-yellow-100 dark:bg-yellow-700 text-yellow-700 dark:text-yellow-300 px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wide">
            Trending
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {games.map((game, index) => {
            const style = colorClasses[game.color];
            return (
              <div
                key={index}
                className={`rounded-xl border ${style.border} ${style.darkBorder} ${style.bg} ${style.darkBg} p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition duration-300`}
              >
                <div className={`h-14 w-14 rounded-lg ${style.iconBg} ${style.iconDarkBg} flex items-center justify-center mb-4`}>
                  <span className={`text-3xl font-extrabold ${style.iconText} ${style.iconDarkText}`}>
                    {game.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{game.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{game.description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-green-700 dark:text-green-300">{game.players}</span> playing now
                  </div>
                  <Link
                    href={game.href}
                    className={`flex items-center text-sm font-semibold ${style.linkText} ${style.linkDarkText} ${style.linkHover} ${style.linkDarkHover} transition duration-200`}
                  >
                    Play <CircleArrowRight className="ml-1 h-5 w-5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularNow;
