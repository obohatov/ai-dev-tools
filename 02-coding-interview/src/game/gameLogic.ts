import { Direction, Position, GameState, GameConfig, DEFAULT_CONFIG } from './types';

export function createInitialState(config: GameConfig = DEFAULT_CONFIG): GameState {
  const center = Math.floor(config.gridSize / 2);
  const snake: Position[] = [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ];

  return {
    snake,
    food: generateFood(snake, config.gridSize),
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    score: 0,
    status: 'idle',
    mode: config.mode,
    gridSize: config.gridSize,
    speed: config.initialSpeed,
  };
}

export function generateFood(snake: Position[], gridSize: number): Position {
  const occupied = new Set(snake.map(p => `${p.x},${p.y}`));
  const available: Position[] = [];

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (!occupied.has(`${x},${y}`)) {
        available.push({ x, y });
      }
    }
  }

  if (available.length === 0) {
    return { x: 0, y: 0 };
  }

  return available[Math.floor(Math.random() * available.length)];
}

export function getNextHead(head: Position, direction: Direction, gridSize: number, mode: 'walls' | 'pass-through'): Position {
  let newX = head.x;
  let newY = head.y;

  switch (direction) {
    case 'UP':
      newY = head.y - 1;
      break;
    case 'DOWN':
      newY = head.y + 1;
      break;
    case 'LEFT':
      newX = head.x - 1;
      break;
    case 'RIGHT':
      newX = head.x + 1;
      break;
  }

  if (mode === 'pass-through') {
    newX = (newX + gridSize) % gridSize;
    newY = (newY + gridSize) % gridSize;
  }

  return { x: newX, y: newY };
}

export function checkCollision(head: Position, snake: Position[], gridSize: number, mode: 'walls' | 'pass-through'): boolean {
  // Wall collision (only in walls mode)
  if (mode === 'walls') {
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      return true;
    }
  }

  // Self collision (skip head)
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

export function isOppositeDirection(current: Direction, next: Direction): boolean {
  return (
    (current === 'UP' && next === 'DOWN') ||
    (current === 'DOWN' && next === 'UP') ||
    (current === 'LEFT' && next === 'RIGHT') ||
    (current === 'RIGHT' && next === 'LEFT')
  );
}

export function moveSnake(state: GameState): GameState {
  if (state.status !== 'playing') {
    return state;
  }

  const head = state.snake[0];
  const newHead = getNextHead(head, state.nextDirection, state.gridSize, state.mode);

  // Check collision before moving
  if (checkCollision(newHead, state.snake, state.gridSize, state.mode)) {
    return { ...state, status: 'gameover' };
  }

  const newSnake = [newHead, ...state.snake];
  let newFood = state.food;
  let newScore = state.score;
  let newSpeed = state.speed;

  // Check if eating food
  if (newHead.x === state.food.x && newHead.y === state.food.y) {
    newScore += 10;
    newFood = generateFood(newSnake, state.gridSize);
    newSpeed = Math.max(50, state.speed - 2); // Speed up slightly
  } else {
    newSnake.pop(); // Remove tail if not eating
  }

  return {
    ...state,
    snake: newSnake,
    food: newFood,
    direction: state.nextDirection,
    score: newScore,
    speed: newSpeed,
  };
}

export function changeDirection(state: GameState, newDirection: Direction): GameState {
  if (isOppositeDirection(state.direction, newDirection)) {
    return state;
  }
  return { ...state, nextDirection: newDirection };
}
