// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Backend User (from API)
export interface BackendUser {
  id: number;
  telegram_id: number;
  username: string | null;
  first_name: string;
  last_name: string | null;
  photo_url: string | null;
  type: 'designer' | 'entrepreneur' | 'company';
  level: number;
  xp: number;
  stars_balance: number;
  status: 'active' | 'warned' | 'banned';
  is_admin: number;
  created_at: string;
  updated_at: string;
}

// Backend Task (from API)
export interface BackendTask {
  id: string;
  creator_id: number;
  title: string;
  description: string | null;
  category: string | null;
  budget_min: number | null;
  budget_max: number | null;
  deadline: string | null;
  status: 'active' | 'hidden' | 'flagged' | 'deleted' | 'completed';
  created_at: string;
  updated_at: string;
}

// Backend Report
export interface BackendReport {
  id: string;
  reporter_id: number;
  content_type: 'task' | 'comment' | 'user' | 'work';
  content_id: string;
  reason: 'spam' | 'inappropriate' | 'fraud' | 'other';
  description: string | null;
  status: 'pending' | 'reviewed' | 'dismissed';
  processed_by: number | null;
  processed_at: string | null;
  created_at: string;
}

// Backend Payment
export interface BackendPayment {
  id: string;
  user_id: number;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  telegram_payment_id: string | null;
  description: string | null;
  created_at: string;
}

// Create Report DTO
export interface CreateReportDto {
  content_type: 'task' | 'comment' | 'user' | 'work';
  content_id: string;
  reason: 'spam' | 'inappropriate' | 'fraud' | 'other';
  description?: string;
}

// User API (frontend representation)
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

// Task API (frontend representation)
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
