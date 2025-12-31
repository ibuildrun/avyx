import { CompletedWork, Notification, Task, Sprint, Mood } from './types';

export const COLORS = {
  background: '#FDFCFB',
  primary: '#FF7F50',
  primaryGradient: 'linear-gradient(135deg, #FF7F50 0%, #FF6B6B 100%)',
  secondary: '#E6E6FA',
  accent: '#A7FFEB',
  text: '#2D3436',
  textSecondary: '#636E72',
  white: '#FFFFFF',
};

export const MOOD_OPTIONS: Mood[] = [
  { emoji: '🌊', label: 'В потоке', color: '#00bfa5', bg: '#e0f2f1' },
  { emoji: '☕', label: 'Нужен кофе', color: '#795548', bg: '#efebe9' },
  { emoji: '✨', label: 'Ищу музу', color: '#673ab7', bg: '#ede7f6' },
  { emoji: '🔥', label: 'Дедлайн горит', color: '#f44336', bg: '#ffebee' },
  { emoji: '🎨', label: 'Вдохновлена', color: '#e91e63', bg: '#fce4ec' },
  { emoji: '☁️', label: 'Кризис', color: '#607d8b', bg: '#eceff1' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'achievement',
    title: 'Новый уровень!',
    message: 'Поздравляем! Вы достигли 2 уровня. Теперь вам доступны заказы с бюджетом от 20 000 ₽.',
    date: '10 мин назад',
    isRead: false
  },
  {
    id: 'n2',
    type: 'update',
    title: 'Отклик одобрен',
    message: 'Заказчик TechStart одобрил ваш отклик на задачу "UI для кофеварки". Свяжитесь в чате.',
    date: '1 час назад',
    isRead: false
  }
];

export const MOCK_SPRINT: Sprint = {
  id: 'sprint_1',
  title: 'Иконка идеального кофе',
  description: 'Нарисуй самую уютную иконку кофе за 15 минут. Используй мягкие цвета и плавные линии.',
  timeLimitMinutes: 15,
  endsAt: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
  submissions: [
    {
      id: 'sub1',
      userId: 'u1',
      userNickname: 'anna_design',
      userAvatar: 'https://i.pravatar.cc/150?u=1',
      image: 'https://picsum.photos/seed/coffee1/400/400',
      likes: 42
    },
    {
      id: 'sub2',
      userId: 'u2',
      userNickname: 'daria_art',
      userAvatar: 'https://i.pravatar.cc/150?u=2',
      image: 'https://picsum.photos/seed/coffee2/400/400',
      likes: 38
    }
  ]
};

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Мобильное приложение для кофейни',
    category: 'UI/UX',
    budget: '15,000 ₽',
    deadline: '3 дня',
    difficulty: 3,
    description: 'Нужен чистый, минималистичный UI для приложения локальной кофейни. Всего 5 экранов.',
    image: 'https://picsum.photos/seed/task1/800/600',
    author: 'Иван Петров',
    authorRating: 4.8,
    authorType: 'entrepreneur',
    likes: 45,
    views: 1240,
    proposals: 12,
    isEscrowProtected: true
  },
  {
    id: '2',
    title: 'Айдентика бренда для стартапа',
    category: 'Логотипы',
    budget: '25,000 ₽',
    deadline: '7 дней',
    difficulty: 5,
    description: 'Логотип, типографика и цветовая палитра для нового стартапа в сфере ИИ.',
    image: 'https://picsum.photos/seed/task2/800/600',
    author: 'ООО "Нексус"',
    authorRating: 5.0,
    authorType: 'company',
    likes: 32,
    views: 3400,
    proposals: 28,
    isEscrowProtected: true
  }
];

export const MOCK_USERS = [
  {
    id: 'u1',
    name: 'Анна Кузнецова',
    nickname: 'anna_design',
    specialty: 'UI/UX Дизайнер',
    avatar: 'https://i.pravatar.cc/150?u=1',
    type: 'designer',
    rating: 4.9,
  },
  {
    id: 'u2',
    name: 'Дарья Денисова',
    nickname: 'daria_art',
    specialty: 'Иллюстратор',
    avatar: 'https://i.pravatar.cc/150?u=2',
    type: 'designer',
    rating: 4.8,
  }
];

export const MOCK_SHOWCASE: CompletedWork[] = [
  {
    id: 'w1',
    title: 'Minimalist Coffee App',
    category: 'UI/UX',
    image: 'https://picsum.photos/seed/work1/800/600',
    author: 'daria_design',
    authorAvatar: 'https://i.pravatar.cc/150?u=daria',
    likes: 1240,
    views: 8900,
    description: 'Полный редизайн приложения для сети кофеен в Скандинавском стиле.',
    comments: [
      { id: 'c1', user: 'alex_ux', avatar: 'https://i.pravatar.cc/150?u=alex', text: 'Очень чистая работа, цвета подобраны идеально!', date: '2 часа назад' }
    ]
  }
];

export const MOCK_MISSIONS = [
  { id: 'm1', title: 'Выполнить первое задание', reward: 'Бейдж: Пионер', progress: 0, isCompleted: false },
  { id: 'm2', title: 'Получить 5 отзывов', reward: '500 бонусного опыта', progress: 60, isCompleted: false },
  { id: 'm3', title: 'Заработать первую 1000₽', reward: 'Промокод на скидку', progress: 100, isCompleted: true }
];

export const LEADERBOARD = [
  { name: 'Анна К.', xp: 12400, rank: 1, avatar: 'https://i.pravatar.cc/150?u=1' },
  { name: 'Дарья Д.', xp: 9800, rank: 2, avatar: 'https://i.pravatar.cc/150?u=2' },
  { name: 'Максим С.', xp: 8700, rank: 3, avatar: 'https://i.pravatar.cc/150?u=3' },
];
