import React from 'react';
import { Button } from '@/components/ui/button';
import { Direction } from '@/game/types';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface MobileControlsProps {
  onDirection: (direction: Direction) => void;
}

export function MobileControls({ onDirection }: MobileControlsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 w-32 mx-auto md:hidden">
      <div />
      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12"
        onTouchStart={() => onDirection('UP')}
        onClick={() => onDirection('UP')}
      >
        <ChevronUp className="w-6 h-6" />
      </Button>
      <div />
      
      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12"
        onTouchStart={() => onDirection('LEFT')}
        onClick={() => onDirection('LEFT')}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      <div />
      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12"
        onTouchStart={() => onDirection('RIGHT')}
        onClick={() => onDirection('RIGHT')}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
      
      <div />
      <Button
        variant="outline"
        size="icon"
        className="h-12 w-12"
        onTouchStart={() => onDirection('DOWN')}
        onClick={() => onDirection('DOWN')}
      >
        <ChevronDown className="w-6 h-6" />
      </Button>
      <div />
    </div>
  );
}
