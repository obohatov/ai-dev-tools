import React from 'react';
import { Button } from '@/components/ui/button';
import { GameMode, GameStatus } from '@/game/types';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  status: GameStatus;
  mode: GameMode;
  score: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onModeChange: (mode: GameMode) => void;
}

export function GameControls({
  status,
  mode,
  score,
  onStart,
  onPause,
  onReset,
  onModeChange,
}: GameControlsProps) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {/* Score display */}
      <div className="text-center">
        <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">Score</p>
        <p className="text-4xl font-bold text-primary neon-text font-pixel">{score}</p>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2">
        <Button
          variant={mode === 'walls' ? 'arcade' : 'outline'}
          size="sm"
          className="flex-1"
          onClick={() => onModeChange('walls')}
          disabled={status === 'playing'}
        >
          Walls
        </Button>
        <Button
          variant={mode === 'pass-through' ? 'arcade' : 'outline'}
          size="sm"
          className="flex-1"
          onClick={() => onModeChange('pass-through')}
          disabled={status === 'playing'}
        >
          Pass-Through
        </Button>
      </div>

      {/* Game controls */}
      <div className="flex gap-2">
        {status === 'idle' || status === 'gameover' ? (
          <Button variant="arcade" size="lg" className="flex-1" onClick={() => { onReset(); onStart(); }}>
            <Play className="w-5 h-5" />
            Start
          </Button>
        ) : (
          <>
            <Button variant="secondary" size="lg" className="flex-1" onClick={onPause}>
              {status === 'paused' ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              {status === 'paused' ? 'Resume' : 'Pause'}
            </Button>
            <Button variant="outline" size="lg" onClick={onReset}>
              <RotateCcw className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>

      {/* Instructions */}
      <div className="text-center text-muted-foreground text-xs">
        <p>Use <span className="text-primary">WASD</span> or <span className="text-primary">Arrow Keys</span> to move</p>
        <p><span className="text-primary">SPACE</span> to pause/resume</p>
      </div>
    </div>
  );
}
