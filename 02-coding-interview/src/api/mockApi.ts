// Centralized mock API layer - all backend calls go through here
// This makes it easy to replace with real API calls later

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  mode: 'walls' | 'pass-through';
  date: Date;
}

export interface LiveGame {
  id: string;
  username: string;
  score: number;
  mode: 'walls' | 'pass-through';
  startedAt: Date;
}

// Simulated delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage
let currentUser: User | null = null;
const users: Map<string, { user: User; password: string }> = new Map();

// Mock leaderboard data
const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', username: 'NeonMaster', score: 2500, mode: 'walls', date: new Date('2024-01-15') },
  { id: '2', username: 'PixelQueen', score: 2340, mode: 'pass-through', date: new Date('2024-01-14') },
  { id: '3', username: 'RetroGamer', score: 2100, mode: 'walls', date: new Date('2024-01-13') },
  { id: '4', username: 'SnakeKing', score: 1980, mode: 'pass-through', date: new Date('2024-01-12') },
  { id: '5', username: 'ArcadeHero', score: 1850, mode: 'walls', date: new Date('2024-01-11') },
  { id: '6', username: 'CyberSnake', score: 1720, mode: 'pass-through', date: new Date('2024-01-10') },
  { id: '7', username: 'GlowWorm', score: 1650, mode: 'walls', date: new Date('2024-01-09') },
  { id: '8', username: 'BitRunner', score: 1580, mode: 'pass-through', date: new Date('2024-01-08') },
  { id: '9', username: 'NightCrawler', score: 1490, mode: 'walls', date: new Date('2024-01-07') },
  { id: '10', username: 'VoidWalker', score: 1420, mode: 'pass-through', date: new Date('2024-01-06') },
];

// Mock live games
const mockLiveGames: LiveGame[] = [
  { id: 'live1', username: 'StreamerPro', score: 450, mode: 'walls', startedAt: new Date() },
  { id: 'live2', username: 'NightOwl', score: 320, mode: 'pass-through', startedAt: new Date() },
  { id: 'live3', username: 'GameMaster', score: 180, mode: 'walls', startedAt: new Date() },
];

// Auth API
export const authApi = {
  async login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    await delay(500);
    
    const userData = users.get(email);
    if (!userData) {
      return { user: null, error: 'User not found' };
    }
    if (userData.password !== password) {
      return { user: null, error: 'Invalid password' };
    }
    
    currentUser = userData.user;
    localStorage.setItem('snake_user', JSON.stringify(currentUser));
    return { user: currentUser, error: null };
  },

  async signup(username: string, email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    await delay(500);
    
    if (users.has(email)) {
      return { user: null, error: 'Email already registered' };
    }
    
    const user: User = {
      id: crypto.randomUUID(),
      username,
      email,
      createdAt: new Date(),
    };
    
    users.set(email, { user, password });
    currentUser = user;
    localStorage.setItem('snake_user', JSON.stringify(currentUser));
    return { user, error: null };
  },

  async logout(): Promise<void> {
    await delay(200);
    currentUser = null;
    localStorage.removeItem('snake_user');
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(100);
    const stored = localStorage.getItem('snake_user');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
    return null;
  },
};

// Leaderboard API
export const leaderboardApi = {
  async getLeaderboard(mode?: 'walls' | 'pass-through'): Promise<LeaderboardEntry[]> {
    await delay(300);
    if (mode) {
      return mockLeaderboard.filter(entry => entry.mode === mode);
    }
    return [...mockLeaderboard];
  },

  async submitScore(score: number, mode: 'walls' | 'pass-through'): Promise<{ success: boolean; rank: number }> {
    await delay(400);
    if (!currentUser) {
      return { success: false, rank: -1 };
    }
    
    const newEntry: LeaderboardEntry = {
      id: crypto.randomUUID(),
      username: currentUser.username,
      score,
      mode,
      date: new Date(),
    };
    
    mockLeaderboard.push(newEntry);
    mockLeaderboard.sort((a, b) => b.score - a.score);
    
    const rank = mockLeaderboard.findIndex(e => e.id === newEntry.id) + 1;
    return { success: true, rank };
  },
};

// Live Games API
export const liveGamesApi = {
  async getLiveGames(): Promise<LiveGame[]> {
    await delay(200);
    // Update scores to simulate live gameplay
    return mockLiveGames.map(game => ({
      ...game,
      score: game.score + Math.floor(Math.random() * 50),
    }));
  },

  async getGameStream(gameId: string): Promise<LiveGame | null> {
    await delay(100);
    return mockLiveGames.find(g => g.id === gameId) || null;
  },
};
