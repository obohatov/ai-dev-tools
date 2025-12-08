import React, { useState, useEffect } from 'react';
import { leaderboardApi, LeaderboardEntry } from '@/api/mockApi';
import { Button } from '@/components/ui/button';
import { GameMode } from '@/game/types';
import { Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LeaderboardTable() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<GameMode | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    leaderboardApi
      .getLeaderboard(filter === 'all' ? undefined : filter)
      .then(data => {
        setEntries(data);
        setLoading(false);
      });
  }, [filter]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground">{rank}</span>;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Filter buttons */}
      <div className="flex gap-2 mb-6 justify-center">
        <Button
          variant={filter === 'all' ? 'arcade' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'walls' ? 'arcade' : 'outline'}
          size="sm"
          onClick={() => setFilter('walls')}
        >
          Walls
        </Button>
        <Button
          variant={filter === 'pass-through' ? 'arcade' : 'outline'}
          size="sm"
          onClick={() => setFilter('pass-through')}
        >
          Pass-Through
        </Button>
      </div>

      {/* Table */}
      <div className="border-2 border-primary rounded-lg overflow-hidden neon-box">
        <div className="bg-card">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 p-3 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-5">Player</div>
            <div className="col-span-2 text-right">Score</div>
            <div className="col-span-3 text-center">Mode</div>
          </div>

          {/* Rows */}
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading...
            </div>
          ) : (
            entries.map((entry, index) => (
              <div
                key={entry.id}
                className={cn(
                  "grid grid-cols-12 gap-2 p-3 items-center transition-colors hover:bg-muted/50",
                  index < 3 && "bg-muted/30"
                )}
              >
                <div className="col-span-2 flex justify-center">
                  {getRankIcon(index + 1)}
                </div>
                <div className="col-span-5 font-medium text-foreground">
                  {entry.username}
                </div>
                <div className="col-span-2 text-right font-bold text-primary">
                  {entry.score.toLocaleString()}
                </div>
                <div className="col-span-3 text-center">
                  <span
                    className={cn(
                      "px-2 py-1 rounded text-xs uppercase",
                      entry.mode === 'walls'
                        ? "bg-destructive/20 text-destructive"
                        : "bg-secondary/20 text-secondary"
                    )}
                  >
                    {entry.mode}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
