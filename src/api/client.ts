import { 
  ApiResponse, 
  ApiUser, 
  ApiTask, 
  BackendUser, 
  BackendTask, 
  BackendReport,
  BackendPayment,
  CreateReportDto 
} from './types';
import { MOCK_TASKS, MOCK_USERS } from '../constants';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const API_VERSION = '/api/v1';

// Store for initData (set by TelegramProvider)
let _initDataRaw: string | null = null;

export const setInitData = (initData: string | null) => {
  _initDataRaw = initData;
};

export const getInitData = () => _initDataRaw;

// Check if we should use real backend
const useRealBackend = () => !!API_BASE_URL && !!_initDataRaw;

// Mock delay to simulate network
const mockDelay = (ms: number = 300) => new Promise(r => setTimeout(r, ms));

// HTTP client with initData auth
async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (_initDataRaw) {
    headers['X-Telegram-Init-Data'] = _initDataRaw;
  }

  const response = await fetch(`${API_BASE_URL}${API_VERSION}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Transform backend user to frontend format
function transformUser(backendUser: BackendUser): ApiUser {
  return {
    id: `tg_${backendUser.telegram_id}`,
    telegramId: backendUser.telegram_id,
    nickname: backendUser.username || `user_${backendUser.telegram_id}`,
    name: `${backendUser.first_name} ${backendUser.last_name || ''}`.trim(),
    specialty: backendUser.type === 'designer' ? 'Дизайнер' : 
               backendUser.type === 'entrepreneur' ? 'Предприниматель' : 'Компания',
    level: backendUser.level,
    xp: backendUser.xp,
    nextLevelXp: backendUser.level * 100,
    rating: 5.0,
    completedTasks: 0,
    reviews: 0,
    role: backendUser.type === 'designer' ? 'designer' : 'client',
    type: backendUser.type,
    streak: 0,
    rank: 999,
    totalEarnings: 0,
    isPro: false,
    stars: backendUser.stars_balance,
    proposalsLeft: 3,
    maxProposals: 3 + backendUser.level,
    hasShield: true,
  };
}


// Transform backend task to frontend format
function transformTask(backendTask: BackendTask): ApiTask {
  return {
    id: backendTask.id,
    title: backendTask.title,
    category: backendTask.category || 'Другое',
    budget: backendTask.budget_max || backendTask.budget_min || 0,
    budgetCurrency: '⭐',
    deadline: backendTask.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: backendTask.description || '',
    difficulty: 3,
    authorId: String(backendTask.creator_id),
    authorName: 'Заказчик',
    authorRating: 5.0,
    authorType: 'entrepreneur',
    likes: 0,
    views: 0,
    proposals: 0,
    isEscrowProtected: true,
    isPremium: false,
    createdAt: backendTask.created_at,
  };
}

// API Client
export const api = {
  // User endpoints
  user: {
    async getMe(): Promise<ApiResponse<ApiUser>> {
      if (!useRealBackend()) {
        await mockDelay();
        const user = MOCK_USERS[0];
        if (user) {
          return { success: true, data: user as unknown as ApiUser };
        }
        return { success: false, error: 'User not found' };
      }

      try {
        const backendUser = await request<BackendUser>('GET', '/users/me');
        return { success: true, data: transformUser(backendUser) };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    },

    async getProfile(userId: string): Promise<ApiResponse<ApiUser>> {
      if (!useRealBackend()) {
        await mockDelay();
        const user = MOCK_USERS.find(u => u.id === userId);
        if (user) {
          return { success: true, data: user as unknown as ApiUser };
        }
        return { success: false, error: 'User not found' };
      }

      try {
        // Extract numeric ID from tg_123 format
        const numericId = userId.startsWith('tg_') ? userId.slice(3) : userId;
        const backendUser = await request<BackendUser>('GET', `/users/${numericId}`);
        return { success: true, data: transformUser(backendUser) };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    },

    async updateProfile(_userId: string, data: Partial<ApiUser>): Promise<ApiResponse<ApiUser>> {
      if (!useRealBackend()) {
        await mockDelay();
        return { success: true, data: { ...data } as ApiUser };
      }

      try {
        const backendUser = await request<BackendUser>('PUT', '/users/me', {
          type: data.type,
          first_name: data.name?.split(' ')[0],
          last_name: data.name?.split(' ').slice(1).join(' ') || null,
        });
        return { success: true, data: transformUser(backendUser) };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    },

    async createFromTelegram(telegramUser: { 
      id: number; 
      firstName: string; 
      lastName?: string; 
      username?: string 
    }): Promise<ApiResponse<ApiUser>> {
      if (!useRealBackend()) {
        await mockDelay();
        const newUser: ApiUser = {
          id: `tg_${telegramUser.id}`,
          telegramId: telegramUser.id,
          nickname: telegramUser.username || `user_${telegramUser.id}`,
          name: `${telegramUser.firstName} ${telegramUser.lastName || ''}`.trim(),
          specialty: 'Новый пользователь',
          level: 1,
          xp: 0,
          nextLevelXp: 100,
          rating: 5.0,
          completedTasks: 0,
          reviews: 0,
          role: 'designer',
          type: 'designer',
          streak: 0,
          rank: 999,
          totalEarnings: 0,
          isPro: false,
          stars: 50,
          proposalsLeft: 3,
          maxProposals: 3,
          hasShield: true,
        };
        return { success: true, data: newUser };
      }

      // With real backend, just call getMe - it will create user if not exists
      return this.getMe();
    },
  },


  // Task endpoints
  tasks: {
    async getAll(filters?: { 
      category?: string; 
      minBudget?: number; 
      maxBudget?: number 
    }): Promise<ApiResponse<ApiTask[]>> {
      if (!useRealBackend()) {
        await mockDelay();
        let tasks = MOCK_TASKS as unknown as ApiTask[];
        
        if (filters?.category && filters.category !== 'Все') {
          tasks = tasks.filter(t => t.category === filters.category);
        }
        
        return { success: true, data: tasks };
      }

      try {
        const params = new URLSearchParams();
        if (filters?.category && filters.category !== 'Все') {
          params.append('category', filters.category);
        }
        params.append('status', 'active');
        
        const queryString = params.toString();
        const path = queryString ? `/tasks?${queryString}` : '/tasks';
        
        const response = await request<{ tasks: BackendTask[]; count: number }>('GET', path);
        const tasks = response.tasks.map(transformTask);
        return { success: true, data: tasks };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    },

    async getById(taskId: string): Promise<ApiResponse<ApiTask>> {
      if (!useRealBackend()) {
        await mockDelay();
        const task = MOCK_TASKS.find(t => t.id === taskId);
        if (task) {
          return { success: true, data: task as unknown as ApiTask };
        }
        return { success: false, error: 'Task not found' };
      }

      try {
        const backendTask = await request<BackendTask>('GET', `/tasks/${taskId}`);
        return { success: true, data: transformTask(backendTask) };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    },

    async create(data: {
      title: string;
      description?: string;
      category?: string;
      budget_min?: number;
      budget_max?: number;
      deadline?: string;
    }): Promise<ApiResponse<ApiTask>> {
      if (!useRealBackend()) {
        await mockDelay();
        return { success: false, error: 'Mock mode - cannot create tasks' };
      }

      try {
        const backendTask = await request<BackendTask>('POST', '/tasks', data);
        return { success: true, data: transformTask(backendTask) };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    },

    async update(taskId: string, data: Partial<{
      title: string;
      description: string;
      category: string;
      budget_min: number;
      budget_max: number;
      deadline: string;
      status: string;
    }>): Promise<ApiResponse<ApiTask>> {
      if (!useRealBackend()) {
        await mockDelay();
        return { success: false, error: 'Mock mode - cannot update tasks' };
      }

      try {
        const backendTask = await request<BackendTask>('PUT', `/tasks/${taskId}`, data);
        return { success: true, data: transformTask(backendTask) };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    },

    async delete(taskId: string): Promise<ApiResponse<void>> {
      if (!useRealBackend()) {
        await mockDelay();
        return { success: false, error: 'Mock mode - cannot delete tasks' };
      }

      try {
        await request<void>('DELETE', `/tasks/${taskId}`);
        return { success: true };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    },

    async apply(_taskId: string, _userId: string, _message: string): Promise<ApiResponse<{ applied: boolean }>> {
      await mockDelay();
      // TODO: Implement when backend supports applications
      return { success: true, data: { applied: true } };
    },
  },


  // Reports endpoints
  reports: {
    async create(data: CreateReportDto): Promise<ApiResponse<BackendReport>> {
      if (!useRealBackend()) {
        await mockDelay();
        return { success: false, error: 'Mock mode - cannot create reports' };
      }

      try {
        const report = await request<BackendReport>('POST', '/reports', data);
        return { success: true, data: report };
      } catch (error) {
        const message = (error as Error).message;
        if (message.includes('already exists')) {
          return { success: false, error: 'Вы уже отправляли жалобу на этот контент' };
        }
        return { success: false, error: message };
      }
    },

    async getMy(): Promise<ApiResponse<BackendReport[]>> {
      if (!useRealBackend()) {
        await mockDelay();
        return { success: true, data: [] };
      }

      try {
        const response = await request<{ reports: BackendReport[] }>('GET', '/reports/my');
        return { success: true, data: response.reports };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    },
  },

  // Payments endpoints
  payments: {
    async createInvoice(amount: number, description?: string): Promise<ApiResponse<{
      payment_id: string;
      amount: number;
      currency: string;
      invoice_payload: string;
    }>> {
      if (!useRealBackend()) {
        await mockDelay();
        return { success: false, error: 'Mock mode - cannot create invoices' };
      }

      try {
        const invoice = await request<{
          payment_id: string;
          amount: number;
          currency: string;
          invoice_payload: string;
        }>('POST', '/payments/invoice', { amount, description });
        return { success: true, data: invoice };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    },

    async getHistory(): Promise<ApiResponse<BackendPayment[]>> {
      if (!useRealBackend()) {
        await mockDelay();
        return { success: true, data: [] };
      }

      try {
        const response = await request<{ payments: BackendPayment[] }>('GET', '/payments/history');
        return { success: true, data: response.payments };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    },
  },

  // Missions endpoints
  missions: {
    async getActive(): Promise<ApiResponse<unknown[]>> {
      await mockDelay();
      // TODO: Implement when backend supports missions
      return { success: true, data: [] };
    },
  },

  // Admin endpoints
  admin: {
    async checkAccess(): Promise<ApiResponse<{ isAdmin: boolean }>> {
      if (!useRealBackend()) {
        return { success: true, data: { isAdmin: false } };
      }

      try {
        await request<unknown>('GET', '/../admin/api/stats');
        return { success: true, data: { isAdmin: true } };
      } catch {
        return { success: true, data: { isAdmin: false } };
      }
    },

    async getStats(): Promise<ApiResponse<{
      users: number;
      tasks: number;
      reports: number;
      payments: number;
    }>> {
      if (!useRealBackend()) {
        return { success: false, error: 'Mock mode' };
      }

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (_initDataRaw) {
          headers['X-Telegram-Init-Data'] = _initDataRaw;
        }

        const response = await fetch(`${API_BASE_URL}/admin/api/stats`, { headers });
        if (!response.ok) throw new Error('Access denied');
        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    },

    async getReports(): Promise<ApiResponse<{ reports: Array<{
      id: string;
      content_type: string;
      content_id: string;
      reason: string;
      description: string | null;
      status: string;
      created_at: string;
    }> }>> {
      if (!useRealBackend()) {
        return { success: false, error: 'Mock mode' };
      }

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (_initDataRaw) {
          headers['X-Telegram-Init-Data'] = _initDataRaw;
        }

        const response = await fetch(`${API_BASE_URL}/admin/api/reports`, { headers });
        if (!response.ok) throw new Error('Access denied');
        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    },

    async processReport(reportId: string, action: string, reason?: string): Promise<ApiResponse<{ success: boolean }>> {
      if (!useRealBackend()) {
        return { success: false, error: 'Mock mode' };
      }

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (_initDataRaw) {
          headers['X-Telegram-Init-Data'] = _initDataRaw;
        }

        const response = await fetch(`${API_BASE_URL}/admin/api/reports/${reportId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ action, reason }),
        });
        if (!response.ok) throw new Error('Failed to process report');
        return { success: true, data: { success: true } };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    },

    async getUsers(): Promise<ApiResponse<{ users: Array<{
      id: number;
      username: string | null;
      first_name: string;
      last_name: string | null;
      status: string;
      level: number;
      created_at: string;
    }> }>> {
      if (!useRealBackend()) {
        return { success: false, error: 'Mock mode' };
      }

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (_initDataRaw) {
          headers['X-Telegram-Init-Data'] = _initDataRaw;
        }

        const response = await fetch(`${API_BASE_URL}/admin/api/users`, { headers });
        if (!response.ok) throw new Error('Access denied');
        const data = await response.json();
        return { success: true, data };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    },

    async updateUser(userId: number, status: string, reason?: string): Promise<ApiResponse<{ success: boolean }>> {
      if (!useRealBackend()) {
        return { success: false, error: 'Mock mode' };
      }

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (_initDataRaw) {
          headers['X-Telegram-Init-Data'] = _initDataRaw;
        }

        const response = await fetch(`${API_BASE_URL}/admin/api/users/${userId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({ status, reason }),
        });
        if (!response.ok) throw new Error('Failed to update user');
        return { success: true, data: { success: true } };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    },
  },
};
