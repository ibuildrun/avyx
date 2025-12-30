// User types
export type UserType = 'designer' | 'entrepreneur' | 'company';
export type UserStatus = 'active' | 'warned' | 'banned';

export interface User {
  id: number;
  telegram_id: number;
  username: string | null;
  first_name: string;
  last_name: string | null;
  photo_url: string | null;
  type: UserType;
  level: number;
  xp: number;
  stars_balance: number;
  status: UserStatus;
  is_admin: number;
  created_at: string;
  updated_at: string;
}

// Task types
export type TaskStatus = 'active' | 'hidden' | 'flagged' | 'deleted' | 'completed';

export interface Task {
  id: string;
  creator_id: number;
  title: string;
  description: string | null;
  category: string | null;
  budget_min: number | null;
  budget_max: number | null;
  deadline: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

// Report types
export type ReportReason = 'spam' | 'inappropriate' | 'fraud' | 'other';
export type ReportStatus = 'pending' | 'reviewed' | 'dismissed';
export type ContentType = 'task' | 'comment' | 'user' | 'work';

export interface Report {
  id: string;
  reporter_id: number;
  content_type: ContentType;
  content_id: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  processed_by: number | null;
  processed_at: string | null;
  created_at: string;
}

// Payment types
export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface Payment {
  id: string;
  user_id: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  telegram_payment_id: string | null;
  description: string | null;
  created_at: string;
}

// Moderation types
export interface ModerationLog {
  id: string;
  admin_id: number;
  action: string;
  target_type: string;
  target_id: string;
  reason: string | null;
  created_at: string;
}

// Telegram types
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

export interface InitDataUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
  is_premium?: boolean;
}

// API types
export interface ApiError {
  error: string;
  message: string;
  details?: unknown;
}

export type ReportAction = 'dismiss' | 'warn_user' | 'hide_content' | 'ban_user';
