import React from 'react';
import { Header } from '@/components/layout/Header';
import { GameBoard } from '@/components/game/GameBoard';
import { GameControls } from '@/components/game/GameControls';
import { MobileControls } from '@/components/game/MobileControls';
import { useGame } from '@/game/useGame';

const Index = () => {
  const { state, startGame, pauseGame, resetGame, setDirection, setMode } = useGame();

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Header />
      
      <main className="pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-pixel text-primary neon-text mb-2">
              SNAKE
            </h1>
            <p className="text-muted-foreground">The classic arcade game, reimagined</p>
          </div>

          {/* Game area */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            <GameBoard state={state} cellSize={18} />
            
            <GameControls
              status={state.status}
              mode={state.mode}
              score={state.score}
              onStart={startGame}
              onPause={pauseGame}
              onReset={resetGame}
              onModeChange={setMode}
            />
          </div>

          {/* Mobile controls */}
          <div className="mt-8">
            <MobileControls onDirection={setDirection} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
