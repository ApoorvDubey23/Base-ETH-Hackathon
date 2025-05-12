
import React from 'react';
import Link from 'next/link';
import GameCard from './GameCard';

const FeaturedGames: React.FC = () => {
  const games = [
    {
      title: "Plinko",
      description: "Watch the ball cascade through pins for exciting multipliers",
      imageUrl: "/placeholder.svg",
      link: "/plinko"
    },
    {
      title: "Limbo",
      description: "Test your luck to see how high the multiplier will climb",
      imageUrl: "/placeholder.svg"
    },
    {
      title: "Dice",
      description: "Roll the dice and predict the outcome for instant wins",
      imageUrl: "/placeholder.svg",
      link: "/Dicegame"
    },
    {
      title: "Mines",
      description: "Clear the field while avoiding hidden mines for big rewards",
      imageUrl: "/placeholder.svg"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Featured Games</h2>
        <Link href="/games" className="text-casino-purple hover:text-casino-purple/80 text-sm font-medium">View All Games →</Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {games.map(game => (
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
