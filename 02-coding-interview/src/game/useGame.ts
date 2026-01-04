import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, GameConfig, Direction, DEFAULT_CONFIG } from './types';
import { createInitialState, moveSnake, changeDirection } from './gameLogic';

export function useGame(config: Partial<GameConfig> = {}) {
  const fullConfig: GameConfig = { ...DEFAULT_CONFIG, ...config };
  const [state, setState] = useState<GameState>(() => createInitialState(fullConfig));
  const gameLoopRef = useRef<number | null>(null);

  const startGame = useCallback(() => {
    setState(prev => ({ ...prev, status: 'playing' }));
  }, []);

  const pauseGame = useCallback(() => {
    setState(prev => {
      if (prev.status === 'playing') {
        return { ...prev, status: 'paused' };
      }
      if (prev.status === 'paused') {
        return { ...prev, status: 'playing' };
      }
      return prev;
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(createInitialState(fullConfig));
  }, [fullConfig]);

  const setDirection = useCallback((direction: Direction) => {
    setState(prev => changeDirection(prev, direction));
  }, []);

  const setMode = useCallback((mode: 'walls' | 'pass-through') => {
    setState(createInitialState({ ...fullConfig, mode }));
  }, [fullConfig]);

  // Game loop
  useEffect(() => {
    if (state.status !== 'playing') {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    let lastUpdate = 0;

    const tick = (timestamp: number) => {
      if (timestamp - lastUpdate >= state.speed) {
        setState(prev => moveSnake(prev));
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
  }, [state.status, state.speed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          setDirection('RIGHT');
          break;
        case ' ':
          e.preventDefault();
          if (state.status === 'idle' || state.status === 'gameover') {
            resetGame();
            startGame();
          } else {
            pauseGame();
          }
          break;
        case 'Escape':
          e.preventDefault();
          pauseGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setDirection, pauseGame, startGame, resetGame, state.status]);

  return {
    state,
    startGame,
    pauseGame,
    resetGame,
    setDirection,
    setMode,
  };
}
