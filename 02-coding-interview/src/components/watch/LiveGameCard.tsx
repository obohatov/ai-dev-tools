import React from 'react';
import { LiveGame } from '@/api/mockApi';
import { Button } from '@/components/ui/button';
import { Eye, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveGameCardProps {
  game: LiveGame;
  onWatch: (gameId: string) => void;
}

export function LiveGameCard({ game, onWatch }: LiveGameCardProps) {
  const elapsedTime = Math.floor((Date.now() - game.startedAt.getTime()) / 1000 / 60);

  return (
    <div className="border-2 border-border rounded-lg p-4 bg-card hover:border-primary transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-xs text-muted-foreground uppercase">Live</span>
        </div>
        <span
          className={cn(
            "px-2 py-1 rounded text-xs uppercase",
            game.mode === 'walls'
              ? "bg-destructive/20 text-destructive"
              : "bg-secondary/20 text-secondary"
          )}
        >
          {game.mode}
        </span>
      </div>

      <h3 className="font-bold text-lg text-foreground mb-1">{game.username}</h3>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-2xl font-bold text-primary">{game.score}</p>
          <p className="text-xs text-muted-foreground">points</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">{elapsedTime}m</p>
          <p className="text-xs text-muted-foreground">playing</p>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => onWatch(game.id)}
      >
        <Eye className="w-4 h-4" />
        Watch
      </Button>
    </div>
  );
}
