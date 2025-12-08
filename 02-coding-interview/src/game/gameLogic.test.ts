import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  generateFood,
  getNextHead,
  checkCollision,
  isOppositeDirection,
  moveSnake,
  changeDirection,
} from './gameLogic';
import { GameState, Position } from './types';

describe('createInitialState', () => {
  it('creates a valid initial state with default config', () => {
    const state = createInitialState();
    
    expect(state.snake).toHaveLength(3);
    expect(state.direction).toBe('RIGHT');
    expect(state.nextDirection).toBe('RIGHT');
    expect(state.score).toBe(0);
    expect(state.status).toBe('idle');
    expect(state.gridSize).toBe(20);
  });

  it('creates state with custom config', () => {
    const state = createInitialState({
      gridSize: 15,
      initialSpeed: 200,
      speedIncrement: 10,
      mode: 'pass-through',
    });
    
    expect(state.gridSize).toBe(15);
    expect(state.speed).toBe(200);
    expect(state.mode).toBe('pass-through');
  });
});

describe('generateFood', () => {
  it('generates food not on snake', () => {
    const snake: Position[] = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];
    
    for (let i = 0; i < 100; i++) {
      const food = generateFood(snake, 10);
      const isOnSnake = snake.some(p => p.x === food.x && p.y === food.y);
      expect(isOnSnake).toBe(false);
    }
  });

  it('generates food within grid bounds', () => {
    const snake: Position[] = [{ x: 5, y: 5 }];
    const gridSize = 10;
    
    for (let i = 0; i < 100; i++) {
      const food = generateFood(snake, gridSize);
      expect(food.x).toBeGreaterThanOrEqual(0);
      expect(food.x).toBeLessThan(gridSize);
      expect(food.y).toBeGreaterThanOrEqual(0);
      expect(food.y).toBeLessThan(gridSize);
    }
  });
});

describe('getNextHead', () => {
  it('moves up correctly', () => {
    const head: Position = { x: 5, y: 5 };
    const next = getNextHead(head, 'UP', 10, 'walls');
    expect(next).toEqual({ x: 5, y: 4 });
  });

  it('moves down correctly', () => {
    const head: Position = { x: 5, y: 5 };
    const next = getNextHead(head, 'DOWN', 10, 'walls');
    expect(next).toEqual({ x: 5, y: 6 });
  });

  it('moves left correctly', () => {
    const head: Position = { x: 5, y: 5 };
    const next = getNextHead(head, 'LEFT', 10, 'walls');
    expect(next).toEqual({ x: 4, y: 5 });
  });

  it('moves right correctly', () => {
    const head: Position = { x: 5, y: 5 };
    const next = getNextHead(head, 'RIGHT', 10, 'walls');
    expect(next).toEqual({ x: 6, y: 5 });
  });

  it('wraps around in pass-through mode (top)', () => {
    const head: Position = { x: 5, y: 0 };
    const next = getNextHead(head, 'UP', 10, 'pass-through');
    expect(next).toEqual({ x: 5, y: 9 });
  });

  it('wraps around in pass-through mode (bottom)', () => {
    const head: Position = { x: 5, y: 9 };
    const next = getNextHead(head, 'DOWN', 10, 'pass-through');
    expect(next).toEqual({ x: 5, y: 0 });
  });

  it('wraps around in pass-through mode (left)', () => {
    const head: Position = { x: 0, y: 5 };
    const next = getNextHead(head, 'LEFT', 10, 'pass-through');
    expect(next).toEqual({ x: 9, y: 5 });
  });

  it('wraps around in pass-through mode (right)', () => {
    const head: Position = { x: 9, y: 5 };
    const next = getNextHead(head, 'RIGHT', 10, 'pass-through');
    expect(next).toEqual({ x: 0, y: 5 });
  });
});

describe('checkCollision', () => {
  it('detects wall collision in walls mode', () => {
    const snake: Position[] = [{ x: 5, y: 5 }];
    
    expect(checkCollision({ x: -1, y: 5 }, snake, 10, 'walls')).toBe(true);
    expect(checkCollision({ x: 10, y: 5 }, snake, 10, 'walls')).toBe(true);
    expect(checkCollision({ x: 5, y: -1 }, snake, 10, 'walls')).toBe(true);
    expect(checkCollision({ x: 5, y: 10 }, snake, 10, 'walls')).toBe(true);
  });

  it('does not detect wall collision in pass-through mode', () => {
    const snake: Position[] = [{ x: 5, y: 5 }];
    
    expect(checkCollision({ x: -1, y: 5 }, snake, 10, 'pass-through')).toBe(false);
    expect(checkCollision({ x: 10, y: 5 }, snake, 10, 'pass-through')).toBe(false);
  });

  it('detects self collision', () => {
    const snake: Position[] = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
      { x: 3, y: 6 },
      { x: 4, y: 6 },
      { x: 5, y: 6 },
    ];
    
    expect(checkCollision({ x: 4, y: 5 }, snake, 10, 'walls')).toBe(true);
    expect(checkCollision({ x: 3, y: 6 }, snake, 10, 'walls')).toBe(true);
  });

  it('does not detect collision on valid move', () => {
    const snake: Position[] = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];
    
    expect(checkCollision({ x: 6, y: 5 }, snake, 10, 'walls')).toBe(false);
  });
});

describe('isOppositeDirection', () => {
  it('returns true for opposite directions', () => {
    expect(isOppositeDirection('UP', 'DOWN')).toBe(true);
    expect(isOppositeDirection('DOWN', 'UP')).toBe(true);
    expect(isOppositeDirection('LEFT', 'RIGHT')).toBe(true);
    expect(isOppositeDirection('RIGHT', 'LEFT')).toBe(true);
  });

  it('returns false for non-opposite directions', () => {
    expect(isOppositeDirection('UP', 'LEFT')).toBe(false);
    expect(isOppositeDirection('UP', 'RIGHT')).toBe(false);
    expect(isOppositeDirection('DOWN', 'LEFT')).toBe(false);
    expect(isOppositeDirection('DOWN', 'RIGHT')).toBe(false);
    expect(isOppositeDirection('LEFT', 'UP')).toBe(false);
    expect(isOppositeDirection('LEFT', 'DOWN')).toBe(false);
    expect(isOppositeDirection('RIGHT', 'UP')).toBe(false);
    expect(isOppositeDirection('RIGHT', 'DOWN')).toBe(false);
  });
});

describe('moveSnake', () => {
  it('does not move when status is not playing', () => {
    const state = createInitialState();
    const newState = moveSnake(state);
    expect(newState).toEqual(state);
  });

  it('moves snake forward when playing', () => {
    const state: GameState = {
      ...createInitialState(),
      status: 'playing',
    };
    const initialHead = state.snake[0];
    const newState = moveSnake(state);
    
    expect(newState.snake[0].x).toBe(initialHead.x + 1);
    expect(newState.snake[0].y).toBe(initialHead.y);
    expect(newState.snake).toHaveLength(3);
  });

  it('grows snake when eating food', () => {
    const state: GameState = {
      ...createInitialState(),
      status: 'playing',
      food: { x: 11, y: 10 }, // One step ahead
    };
    state.snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    
    const newState = moveSnake(state);
    
    expect(newState.snake).toHaveLength(4);
    expect(newState.score).toBe(10);
  });

  it('ends game on wall collision in walls mode', () => {
    const state: GameState = {
      ...createInitialState(),
      status: 'playing',
      mode: 'walls',
    };
    state.snake = [{ x: 19, y: 10 }, { x: 18, y: 10 }, { x: 17, y: 10 }];
    
    const newState = moveSnake(state);
    
    expect(newState.status).toBe('gameover');
  });

  it('wraps around in pass-through mode', () => {
    const state: GameState = {
      ...createInitialState(),
      status: 'playing',
      mode: 'pass-through',
    };
    state.snake = [{ x: 19, y: 10 }, { x: 18, y: 10 }, { x: 17, y: 10 }];
    
    const newState = moveSnake(state);
    
    expect(newState.status).toBe('playing');
    expect(newState.snake[0].x).toBe(0);
  });
});

describe('changeDirection', () => {
  it('changes direction to valid direction', () => {
    const state: GameState = {
      ...createInitialState(),
      direction: 'RIGHT',
    };
    
    const newState = changeDirection(state, 'UP');
    expect(newState.nextDirection).toBe('UP');
  });

  it('does not change to opposite direction', () => {
    const state: GameState = {
      ...createInitialState(),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
    };
    
    const newState = changeDirection(state, 'LEFT');
    expect(newState.nextDirection).toBe('RIGHT');
  });
});
