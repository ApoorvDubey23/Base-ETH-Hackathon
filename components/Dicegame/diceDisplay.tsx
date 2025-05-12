import React from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiceDisplayProps {
  value: number;
  rolling?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const DiceDisplay: React.FC<DiceDisplayProps> = ({
  value,
  rolling = false,
  size = 'md',
  className,
}) => {
  const getDiceIcon = () => {
    const sizeMap = {
      sm: 24,
      md: 48,
      lg: 72,
    };

    const iconSize = sizeMap[size];
    const iconProps = {
      size: iconSize,
      className: cn(
        "dice-icon",
        rolling && "animate-dice-roll",
        className
      ),
    };

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

  return (
    <div
      className={cn(
        "dice-container",
        rolling ? "animate-dice-roll" : "animate-scale-in",
        className
      )}
    >
      {getDiceIcon()}
    </div>
  );
};

export default DiceDisplay;
