import { ApiResponse, ApiUser, ApiTask } from './types';
import { MOCK_TASKS, MOCK_USERS } from '../constants';

// Mock delay to simulate network
const mockDelay = (ms: number = 300) => new Promise(r => setTimeout(r, ms));

// API Client - currently mock, will connect to real backend
export const api = {
  // User endpoints
  user: {
    async getProfile(userId: string): Promise<ApiResponse<ApiUser>> {
      await mockDelay();
      const user = MOCK_USERS.find(u => u.id === userId);
      if (user) {
        return { success: true, data: user as unknown as ApiUser };
      }
      return { success: false, error: 'User not found' };
    },

    async updateProfile(_userId: string, data: Partial<ApiUser>): Promise<ApiResponse<ApiUser>> {
      await mockDelay();
      // Mock update - in real app this goes to backend
      return { success: true, data: { ...data } as ApiUser };
    },

    async createFromTelegram(telegramUser: { id: number; firstName: string; lastName?: string; username?: string }): Promise<ApiResponse<ApiUser>> {
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
    },
  },

  // Task endpoints
  tasks: {
    async getAll(filters?: { category?: string; minBudget?: number; maxBudget?: number }): Promise<ApiResponse<ApiTask[]>> {
      await mockDelay();
      let tasks = MOCK_TASKS as unknown as ApiTask[];
      
      if (filters?.category && filters.category !== 'Все') {
        tasks = tasks.filter(t => t.category === filters.category);
      }
      
      return { success: true, data: tasks };
    },

    async getById(taskId: string): Promise<ApiResponse<ApiTask>> {
      await mockDelay();
      const task = MOCK_TASKS.find(t => t.id === taskId);
      if (task) {
        return { success: true, data: task as unknown as ApiTask };
      }
      return { success: false, error: 'Task not found' };
    },

    async apply(_taskId: string, _userId: string, _message: string): Promise<ApiResponse<{ applied: boolean }>> {
      await mockDelay();
      // Mock apply - in real app this goes to backend
      return { success: true, data: { applied: true } };
    },
  },

  // Missions endpoints
  missions: {
    async getActive(): Promise<ApiResponse<any[]>> {
      await mockDelay();
      // Return mock missions from constants
      return { success: true, data: [] };
    },
  },
};

// Future: Real API client
// export const createApiClient = (baseUrl: string, token?: string) => {
//   const headers = {
//     'Content-Type': 'application/json',
//     ...(token && { Authorization: `Bearer ${token}` }),
//   };
//   
//   return {
//     async get<T>(path: string): Promise<ApiResponse<T>> {
//       const res = await fetch(`${baseUrl}${path}`, { headers });
//       return res.json();
//     },
//     async post<T>(path: string, body: any): Promise<ApiResponse<T>> {
//       const res = await fetch(`${baseUrl}${path}`, {
//         method: 'POST',
//         headers,
//         body: JSON.stringify(body),
//       });
//       return res.json();
//     },
//   };
// };
