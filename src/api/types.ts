// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// User API
export interface ApiUser {
  id: string;
  telegramId?: number;
  nickname: string;
  name: string;
  specialty: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  rating: number;
  completedTasks: number;
  reviews: number;
  role: 'designer' | 'client';
  type: 'designer' | 'entrepreneur' | 'company';
  streak: number;
  rank: number;
  totalEarnings: number;
  about?: string;
  bannerImage?: string;
  avatarBorderColor?: string;
  isPro?: boolean;
  stars: number;
  proposalsLeft: number;
  maxProposals: number;
  hasShield: boolean;
  isHeroOfDay?: boolean;
}

// Task API
export interface ApiTask {
  id: string;
  title: string;
  category: string;
  budget: number;
  budgetCurrency: string;
  deadline: string;
  description: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  image?: string;
  authorId: string;
  authorName: string;
  authorRating: number;
  authorType: 'designer' | 'entrepreneur' | 'company';
  likes: number;
  views: number;
  proposals: number;
  isEscrowProtected: boolean;
  isPremium: boolean;
  minLevel?: number;
  createdAt: string;
}

// Storage interface
export interface StorageAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}
