import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { LiveGameCard } from '@/components/watch/LiveGameCard';
import { WatchView } from '@/components/watch/WatchView';
import { liveGamesApi, LiveGame } from '@/api/mockApi';
import { Eye, Loader2 } from 'lucide-react';

const Watch = () => {
  const [games, setGames] = useState<LiveGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [watchingGame, setWatchingGame] = useState<LiveGame | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      const data = await liveGamesApi.getLiveGames();
      setGames(data);
      setLoading(false);
    };

    fetchGames();

    // Refresh live scores periodically
    const interval = setInterval(fetchGames, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleWatch = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (game) {
      setWatchingGame(game);
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Header />
      
      <main className="pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Eye className="w-10 h-10 text-secondary" />
              <h1 className="text-3xl md:text-4xl font-pixel text-primary neon-text">
                WATCH LIVE
              </h1>
            </div>
            <p className="text-muted-foreground">Watch other players in real-time</p>
          </div>

          {/* Live games grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No live games at the moment</p>
              <p className="text-sm text-muted-foreground mt-2">Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map(game => (
                <LiveGameCard
                  key={game.id}
                  game={game}
                  onWatch={handleWatch}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Watch modal */}
      {watchingGame && (
        <WatchView
          gameId={watchingGame.id}
          username={watchingGame.username}
          mode={watchingGame.mode}
          onClose={() => setWatchingGame(null)}
        />
      )}
    </div>
  );
};

export default Watch;
