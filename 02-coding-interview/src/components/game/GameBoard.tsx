import React from 'react';
import { GameState } from '@/game/types';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  state: GameState;
  cellSize?: number;
  className?: string;
}

export function GameBoard({ state, cellSize = 20, className }: GameBoardProps) {
  const { snake, food, gridSize, mode } = state;

  const boardSize = gridSize * cellSize;
  const headPosition = snake[0];

  return (
    <div
      className={cn(
        "relative border-4 border-primary neon-box bg-background/50",
        mode === 'pass-through' && "border-dashed",
        className
      )}
      style={{ width: boardSize, height: boardSize }}
    >
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: `${cellSize}px ${cellSize}px`,
        }}
      />

      {/* Food */}
      <div
        className="absolute rounded-full bg-destructive animate-pulse"
        style={{
          width: cellSize - 4,
          height: cellSize - 4,
          left: food.x * cellSize + 2,
          top: food.y * cellSize + 2,
          boxShadow: '0 0 10px hsl(0 100% 50% / 0.8), 0 0 20px hsl(0 100% 50% / 0.5)',
        }}
      />

      {/* Snake */}
      {snake.map((segment, index) => {
        const isHead = index === 0;
        const isTail = index === snake.length - 1;
        
        return (
          <div
            key={index}
            className={cn(
              "absolute transition-all duration-75",
              isHead && "rounded-md",
              !isHead && !isTail && "rounded-sm",
              isTail && "rounded-sm"
            )}
            style={{
              width: cellSize - 2,
              height: cellSize - 2,
              left: segment.x * cellSize + 1,
              top: segment.y * cellSize + 1,
              backgroundColor: isHead 
                ? 'hsl(120 100% 60%)' 
                : `hsl(120 100% ${Math.max(30, 50 - index * 2)}%)`,
              boxShadow: isHead 
                ? '0 0 10px hsl(120 100% 50% / 0.8), 0 0 20px hsl(120 100% 50% / 0.5)'
                : 'none',
            }}
          >
            {isHead && (
              <>
                {/* Eyes */}
                <div 
                  className="absolute bg-background rounded-full"
                  style={{
                    width: 4,
                    height: 4,
                    top: 4,
                    left: state.direction === 'LEFT' ? 2 : state.direction === 'RIGHT' ? cellSize - 10 : 4,
                  }}
                />
                <div 
                  className="absolute bg-background rounded-full"
                  style={{
                    width: 4,
                    height: 4,
                    top: 4,
                    right: state.direction === 'RIGHT' ? 2 : state.direction === 'LEFT' ? cellSize - 10 : 4,
                  }}
                />
              </>
            )}
          </div>
        );
      })}

      {/* Game status overlays */}
      {state.status === 'idle' && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="text-center">
            <p className="text-primary font-pixel text-lg mb-2 neon-text">READY</p>
            <p className="text-muted-foreground text-sm">Press SPACE to start</p>
          </div>
        </div>
      )}

      {state.status === 'paused' && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="text-center">
            <p className="text-secondary font-pixel text-lg mb-2 animate-pulse">PAUSED</p>
            <p className="text-muted-foreground text-sm">Press SPACE to resume</p>
          </div>
        </div>
      )}

      {state.status === 'gameover' && (
        <div className="absolute inset-0 bg-background/90 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive font-pixel text-lg mb-2">GAME OVER</p>
            <p className="text-primary text-2xl font-bold mb-4">{state.score}</p>
            <p className="text-muted-foreground text-sm">Press SPACE to restart</p>
          </div>
        </div>
      )}
    </div>
  );
}
