
import React, { useState, useEffect } from 'react';
import { Screen, Task, User, CompletedWork, Badge, PortfolioItem } from './types';
import { MOCK_MISSIONS, MOCK_SPRINT } from './constants';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import ProfileScreen from './screens/ProfileScreen';
import MissionsScreen from './screens/MissionsScreen';
import TaskDetailScreen from './screens/TaskDetailScreen';
import CreateTaskScreen from './screens/CreateTaskScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import WorkDetailScreen from './screens/WorkDetailScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import MarketplaceScreen from './screens/MarketplaceScreen';
import PortfolioWizardScreen from './screens/PortfolioWizardScreen';
import SprintScreen from './screens/SprintScreen';

// Icons
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);
const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);
const MissionIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
);
const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const INITIAL_BADGES: Badge[] = [
  { id: 'b1', name: 'Огонек', icon: 'fire', description: 'За 5 дней активности подряд', isUnlocked: true, color: 'text-orange-500' },
  { id: 'b2', name: 'Спринтер', icon: 'zap', description: 'За быструю сдачу проектов', isUnlocked: false, color: 'text-yellow-500' },
  { id: 'b3', name: 'Креатор', icon: 'palette', description: 'Проекты в 3 разных категориях', isUnlocked: true, color: 'text-indigo-500' },
  { id: 'b4', name: 'Качество', icon: 'star', description: 'Рейтинг 5.0 по 10 отзывам', isUnlocked: false, color: 'text-emerald-500' },
  { id: 'b5', name: 'Бета', icon: 'code', description: 'Участник тестирования AVYX', isUnlocked: true, color: 'text-gray-400' },
  { id: 'b6', name: 'Агент', icon: 'users', description: 'Пригласил 3 друзей', isUnlocked: false, color: 'text-teal-500' }
];

export const calculateMaxProposals = (level: number, isPro: boolean): number => {
  if (isPro) return 999;
  return 3 + Math.floor((level - 1) / 3);
};

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedWork, setSelectedWork] = useState<CompletedWork | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('avyx_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentScreen('home');
    }
  }, []);

  const checkLevelUp = (u: User): User => {
    let updated = { ...u };
    while (updated.xp >= updated.nextLevelXp) {
      updated.xp -= updated.nextLevelXp;
      updated.level += 1;
      updated.nextLevelXp = Math.floor(updated.nextLevelXp * 1.2);
      updated.maxProposals = calculateMaxProposals(updated.level, updated.isPro || false);
      // При левелапе восполняем отклики
      updated.proposalsLeft = updated.maxProposals;
    }
    return updated;
  };

  const handleOnboardingComplete = (userData: Partial<User>) => {
    const level = 1;
    const isPro = false;
    const maxProposals = calculateMaxProposals(level, isPro);
    
    const fullUser: User = {
      nickname: userData.nickname || "new_user",
      name: userData.name || "Новый Пользователь",
      specialty: userData.specialty || (userData.role === 'designer' ? "UI/UX Дизайнер" : "Заказчик"),
      level: level,
      xp: 0,
      nextLevelXp: 100,
      rating: 5.0,
      completedTasks: 0,
      reviews: 0,
      totalEarnings: 0,
      role: userData.role || 'designer',
      type: userData.type || 'designer',
      streak: 5,
      rank: 999,
      portfolio: [],
      isPro: isPro,
      stars: 50,
      proposalsLeft: maxProposals,
      maxProposals: maxProposals,
      hasShield: true,
      badges: INITIAL_BADGES,
      appliedTasks: [],
      ...userData
    };
    setUser(fullUser);
    localStorage.setItem('avyx_user', JSON.stringify(fullUser));
    setCurrentScreen('home');
  };

  const handleUserUpdate = (updatedUser: User) => {
    const checkedUser = checkLevelUp(updatedUser);
    setUser(checkedUser);
    localStorage.setItem('avyx_user', JSON.stringify(checkedUser));
  };

  const handleAddPortfolioWork = (newItem: PortfolioItem) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      portfolio: [newItem, ...user.portfolio],
      xp: user.xp + 25 // Награда за добавление работы
    };
    handleUserUpdate(updatedUser);
    setCurrentScreen('profile');
  };

  const renderScreen = () => {
    if (currentScreen === 'onboarding') {
      return <OnboardingScreen onComplete={handleOnboardingComplete} />;
    }

    if (!user) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    switch (currentScreen) {
      case 'home':
        return <HomeScreen 
          user={user}
          onTaskSelect={(task) => { setSelectedTask(task); setCurrentScreen('task-detail'); }} 
          onWorkSelect={(work) => { setSelectedWork(work); setCurrentScreen('work-detail'); }}
          onOpenNotifications={() => setCurrentScreen('notifications')}
        />;
      case 'search':
        return <SearchScreen user={user} onTaskSelect={(task) => { setSelectedTask(task); setCurrentScreen('task-detail'); }} />;
      case 'create':
        return <CreateTaskScreen onBack={() => setCurrentScreen('home')} />;
      case 'missions':
        return <MissionsScreen missions={MOCK_MISSIONS} onSprintOpen={() => setCurrentScreen('sprint')} />;
      case 'sprint':
        return <SprintScreen sprint={MOCK_SPRINT} user={user} onBack={() => setCurrentScreen('missions')} onParticipate={() => setCurrentScreen('portfolio-wizard')} />;
      case 'profile':
        // Fix: Pass missing onUpdateUser prop to ProfileScreen
        return <ProfileScreen 
          user={user} 
          onEdit={() => setCurrentScreen('edit-profile')} 
          onOpenMarketplace={() => setCurrentScreen('marketplace')}
          onAddWork={() => setCurrentScreen('portfolio-wizard')}
          onUpdateUser={handleUserUpdate}
        />;
      case 'portfolio-wizard':
        return <PortfolioWizardScreen onSave={handleAddPortfolioWork} onBack={() => setCurrentScreen('profile')} />;
      case 'edit-profile':
        return <EditProfileScreen user={user} onSave={(u) => { handleUserUpdate(u); setCurrentScreen('profile'); }} onBack={() => setCurrentScreen('profile')} />;
      case 'notifications':
        return <NotificationsScreen onBack={() => setCurrentScreen('home')} />;
      case 'marketplace':
        return <MarketplaceScreen user={user} onBack={() => setCurrentScreen('profile')} onPurchase={(updated) => handleUserUpdate(updated)} />;
      case 'task-detail':
        return selectedTask ? <TaskDetailScreen task={selectedTask} user={user} onUpdateUser={handleUserUpdate} onBack={() => setCurrentScreen('home')} /> : null;
      case 'work-detail':
        return selectedWork ? <WorkDetailScreen work={selectedWork} onBack={() => setCurrentScreen('home')} /> : null;
      default:
        return <HomeScreen 
          user={user}
          onTaskSelect={(task) => { setSelectedTask(task); setCurrentScreen('task-detail'); }} 
          onWorkSelect={(work) => { setSelectedWork(work); setCurrentScreen('work-detail'); }}
          onOpenNotifications={() => setCurrentScreen('notifications')}
        />;
    }
  };

  return (
    <div className="max-w-[428px] mx-auto min-h-screen flex flex-col relative overflow-hidden bg-[#FDFCFB]">
      <main className="flex-1 overflow-y-auto pb-24">
        {renderScreen()}
      </main>

      {currentScreen !== 'onboarding' && currentScreen !== 'edit-profile' && currentScreen !== 'portfolio-wizard' && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-[428px] mx-auto bg-white/95 backdrop-blur-xl border-t border-gray-100 flex justify-around items-center h-20 px-4 pb-2 z-50">
          <button 
            onClick={() => setCurrentScreen('home')} 
            className={`flex flex-col items-center gap-1 transition-colors ${['home', 'task-detail', 'work-detail', 'notifications'].includes(currentScreen) ? 'text-[#FF7F50]' : 'text-gray-400'}`}
          >
            <HomeIcon />
            <span className="text-[9px] font-black uppercase tracking-widest">Лента</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('search')} 
            className={`flex flex-col items-center gap-1 transition-colors ${currentScreen === 'search' ? 'text-[#FF7F50]' : 'text-gray-400'}`}
          >
            <SearchIcon />
            <span className="text-[9px] font-black uppercase tracking-widest">Поиск</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('create')} 
            className="coral-gradient text-white p-4 rounded-3xl shadow-lg -mt-10 border-4 border-[#FDFCFB] transition-all hover:scale-110 active:scale-90"
          >
            <PlusIcon />
          </button>
          <button 
            onClick={() => setCurrentScreen('missions')} 
            className={`flex flex-col items-center gap-1 transition-colors ${['missions', 'sprint'].includes(currentScreen) ? 'text-[#FF7F50]' : 'text-gray-400'}`}
          >
            <MissionIcon />
            <span className="text-[9px] font-black uppercase tracking-widest">Квесты</span>
          </button>
          <button 
            onClick={() => setCurrentScreen('profile')} 
            className={`flex flex-col items-center gap-1 transition-colors ${['profile', 'marketplace'].includes(currentScreen) ? 'text-[#FF7F50]' : 'text-gray-400'}`}
          >
            <UserIcon />
            <span className="text-[9px] font-black uppercase tracking-widest">Профиль</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
