export type Category = 'UI/UX' | 'Графика' | 'Иллюстрация' | 'Логотипы' | 'Все';
export type UserType = 'designer' | 'entrepreneur' | 'company';
export type TaskDifficulty = 1 | 2 | 3 | 4 | 5;

export interface Mood {
  emoji: string;
  label: string;
  color: string;
  bg: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  isUnlocked: boolean;
  color: string;
}

export interface Challenge {
  type: 'speed' | 'quality' | 'bonus';
  label: string;
  reward: string;
}

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  date: string;
}

export interface CompletedWork {
  id: string;
  title: string;
  category: Category;
  image: string;
  author: string;
  authorAvatar: string;
  likes: number;
  views: number;
  comments: Comment[];
  description: string;
}

export interface Task {
  id: string;
  title: string;
  category: Category;
  budget: string;
  deadline: string;
  description: string;
  difficulty: TaskDifficulty;
  image?: string;
  author: string;
  authorRating: number;
  authorType: UserType;
  likes: number;
  views: number;
  proposals: number;
  isBookmarked?: boolean;
  isFeatured?: boolean;
  minLevel?: number;
  isPremium?: boolean;
  isEscrowProtected?: boolean;
  challenge?: Challenge;
}

export interface Mission {
  id: string;
  title: string;
  reward: string;
  progress: number;
  isCompleted: boolean;
}

export interface SprintSubmission {
  id: string;
  userId: string;
  userNickname: string;
  userAvatar: string;
  image: string;
  likes: number;
}

export interface Sprint {
  id: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  endsAt: string;
  submissions: SprintSubmission[];
  heroOfTheDay?: string;
}

export type NotificationType = 'response' | 'update' | 'deadline' | 'achievement' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
}

export interface User {
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
  type: UserType;
  streak: number;
  rank: number;
  totalEarnings: number;
  about?: string;
  bannerImage?: string;
  avatarBorderColor?: string;
  portfolio: PortfolioItem[];
  isPro?: boolean;
  stars: number;
  proposalsLeft: number;
  maxProposals: number;
  hasShield: boolean;
  badges: Badge[];
  appliedTasks?: string[];
  isHeroOfDay?: boolean;
  mood?: Mood;
}

export interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  likes: number;
  views: number;
}

export type Screen = 'onboarding' | 'home' | 'search' | 'create' | 'missions' | 'profile' | 'task-detail' | 'portfolio-wizard' | 'work-detail' | 'notifications' | 'edit-profile' | 'marketplace' | 'sprint' | 'admin';
