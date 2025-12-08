import React from 'react';
import { Header } from '@/components/layout/Header';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { Trophy } from 'lucide-react';

const Leaderboard = () => {
  return (
    <div className="min-h-screen bg-background grid-bg">
      <Header />
      
      <main className="pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Trophy className="w-10 h-10 text-yellow-400" />
              <h1 className="text-3xl md:text-4xl font-pixel text-primary neon-text">
                LEADERBOARD
              </h1>
              <Trophy className="w-10 h-10 text-yellow-400" />
            </div>
            <p className="text-muted-foreground">Top players across all game modes</p>
          </div>

          <LeaderboardTable />
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
