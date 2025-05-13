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
      title: "Limbo",
      description: "Test your luck to see how high the multiplier will climb.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKUVrcnBCdZVgf3mf9kUaxMIJofW4sVxhPIA&s",
      link: "/limbo"
    },
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
    <div className="max-w-screen-2xl mx-auto px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Featured Games on MetaBet
        </h2>
        <Button
          className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 text-sm font-medium transition-colors"
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