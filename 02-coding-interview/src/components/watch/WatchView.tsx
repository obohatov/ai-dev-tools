import React, { useState, useEffect, useRef } from 'react';
import { GameBoard } from '@/components/game/GameBoard';
import { Button } from '@/components/ui/button';
import { GameState, Direction, Position } from '@/game/types';
import { createInitialState, moveSnake, changeDirection, generateFood } from '@/game/gameLogic';
import { X, User } from 'lucide-react';

interface WatchViewProps {
  gameId: string;
  username: string;
  mode: 'walls' | 'pass-through';
  onClose: () => void;
}

// Simulated AI that plays the game
function getAIDirection(state: GameState): Direction {
  const head = state.snake[0];
  const food = state.food;
  
  // Simple AI: move towards food while avoiding immediate collisions
  const possibleDirections: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  const opposites: Record<Direction, Direction> = {
    'UP': 'DOWN',
    'DOWN': 'UP',
    'LEFT': 'RIGHT',
    'RIGHT': 'LEFT',
  };

  // Filter out opposite direction
  const validDirections = possibleDirections.filter(d => d !== opposites[state.direction]);

  // Calculate scores for each direction
  const scores = validDirections.map(dir => {
    let newX = head.x;
    let newY = head.y;

    switch (dir) {
      case 'UP': newY--; break;
      case 'DOWN': newY++; break;
      case 'LEFT': newX--; break;
      case 'RIGHT': newX++; break;
    }

    // Wrap around for pass-through mode
    if (state.mode === 'pass-through') {
      newX = (newX + state.gridSize) % state.gridSize;
      newY = (newY + state.gridSize) % state.gridSize;
    }

    // Check for collision
    const hitsWall = state.mode === 'walls' && 
      (newX < 0 || newX >= state.gridSize || newY < 0 || newY >= state.gridSize);
    const hitsSelf = state.snake.some(s => s.x === newX && s.y === newY);

    if (hitsWall || hitsSelf) {
      return { dir, score: -1000 };
    }

    // Score based on distance to food
    const distance = Math.abs(newX - food.x) + Math.abs(newY - food.y);
    return { dir, score: -distance };
  });

  // Pick best direction
  scores.sort((a, b) => b.score - a.score);
  
  // Add some randomness occasionally
  if (Math.random() < 0.1 && scores.length > 1 && scores[1].score > -100) {
    return scores[1].dir;
  }

  return scores[0]?.dir || state.direction;
}

export function WatchView({ gameId, username, mode, onClose }: WatchViewProps) {
  const [state, setState] = useState<GameState>(() => ({
    ...createInitialState({ gridSize: 20, initialSpeed: 150, speedIncrement: 5, mode }),
    status: 'playing',
    score: Math.floor(Math.random() * 300) + 100, // Start with some score
  }));

  const gameLoopRef = useRef<number | null>(null);

  useEffect(() => {
    let lastUpdate = 0;
    let lastDirectionChange = 0;

    const tick = (timestamp: number) => {
      // Change direction periodically
      if (timestamp - lastDirectionChange >= 200) {
        setState(prev => {
          if (prev.status !== 'playing') return prev;
          const newDir = getAIDirection(prev);
          return changeDirection(prev, newDir);
        });
        lastDirectionChange = timestamp;
      }

      // Move snake
      if (timestamp - lastUpdate >= state.speed) {
        setState(prev => {
          if (prev.status === 'gameover') {
            // Restart the AI game after game over
            return {
              ...createInitialState({ gridSize: 20, initialSpeed: 150, speedIncrement: 5, mode }),
              status: 'playing',
              score: 0,
            };
          }
          return moveSnake(prev);
        });
        lastUpdate = timestamp;
      }

      gameLoopRef.current = requestAnimationFrame(tick);
    };

    gameLoopRef.current = requestAnimationFrame(tick);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [mode, state.speed]);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border-2 border-primary rounded-lg p-6 neon-box max-w-lg w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span className="font-bold text-foreground">{username}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex justify-center mb-4">
          <GameBoard state={state} cellSize={16} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase">Score</p>
            <p className="text-2xl font-bold text-primary">{state.score}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase">Mode</p>
            <span className={`px-2 py-1 rounded text-xs uppercase ${
              mode === 'walls' ? 'bg-destructive/20 text-destructive' : 'bg-secondary/20 text-secondary'
            }`}>
              {mode}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
