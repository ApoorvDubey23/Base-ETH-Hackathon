import React from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiceDisplayProps {
  value: number;
  rolling?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const DiceDisplay: React.FC<DiceDisplayProps> = ({
  value,
  rolling = false,
  size = 'xl',
  className,
}) => {
  const sizeMap = {
    sm: 24,
    md: 48,
    lg: 72,
    xl: 196,
  };

  const iconSize = sizeMap[size];

  const iconProps = {
    size: iconSize,
    className: cn(
      "dice-icon text-gray-800 dark:text-gray-200",
      rolling && "animate-dice-roll",
      className
    ),
  };

  const getDiceIcon = () => {
    switch (value) {
      case 1:
        return <Dice1 {...iconProps} />;
      case 2:
        return <Dice2 {...iconProps} />;
      case 3:
        return <Dice3 {...iconProps} />;
      case 4:
        return <Dice4 {...iconProps} />;
      case 5:
        return <Dice5 {...iconProps} />;
      case 6:
        return <Dice6 {...iconProps} />;
      default:
        return <Dice1 {...iconProps} />;
    }
  };

  const containerStyles =
    size === 'xl'
      ? "bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl shadow-2xl"
      : "bg-white dark:bg-gray-800 p-2 rounded-md shadow";

  return (
    <div
      className={cn(
        "dice-container",
        containerStyles,
        rolling ? "animate-dice-roll" : "animate-scale-in",
        className
      )}
    >
      {getDiceIcon()}
    </div>
  );
};

export default DiceDisplay;
