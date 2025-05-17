import React from 'react';
import Link from 'next/link';
import GameCard from './GameCard';
import { Button } from './ui/button';

const FeaturedGames: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const games = [
    {
      title: "Plinko",
      description: "Watch the ball cascade through pins for exciting multipliers.",
      imageUrl: "https://photosnow.org/wp-content/uploads/2025/02/Play-Plinko-at-Non-UK-Licensed-Casinos.jpg",
      link: "/plinko"
    },
    {
      title: "Dice",
      description: "Roll the dice and predict the outcome for instant wins.",
      imageUrl: "https://media.istockphoto.com/id/1265721550/photo/close-up-shot-of-a-pair-of-dice-rolling-down-a-craps-table-selective-focus-gambling-concept.jpg?s=612x612&w=0&k=20&c=iGVPQAr63BcsM2Rg0-RPpb-Tvv8d6bECZbWa1L8pKK8=",
      link: "/Dicegame"
    },
    {
      title: "Mines",
      description: "Clear the field while avoiding hidden mines for big rewards.",
      imageUrl: "https://storage.googleapis.com/kickthe/assets/images/games/mines-hacksawgaming/gb/gbp/tile_large.jpg",
      link: "/mines"
    }
  ];

  return (
    <div className="max-w-screen-2xl mx-auto px-8 py-8 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-black transition-colors ease-in-out">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 md:mb-0 drop-shadow-lg">
          Featured Games on MetaBet
        </h2>
        <Button
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white dark:from-purple-400 dark:to-indigo-400 hover:opacity-90 transition-all font-semibold py-2 px-4 rounded shadow-md"
          onClick={() => scrollToSection("popular-now")}
        >
          View All Games →
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <GameCard
            key={game.title}
            title={game.title}
            description={game.description}
            imageUrl={game.imageUrl}
            link={game.link}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedGames;