import React, { useState } from 'react';
import { Task, Category, CompletedWork, User } from '../types';
import { MOCK_TASKS, MOCK_SHOWCASE, MOCK_NOTIFICATIONS, MOCK_USERS } from '../constants';
import Avatar from '../components/Avatar';
import SmartImage from '../components/SmartImage';

interface HomeScreenProps {
  user: User;
  onTaskSelect: (task: Task) => void;
  onWorkSelect: (work: CompletedWork) => void;
  onOpenNotifications: () => void;
}

type MainTab = 'tasks' | 'showcase';

const Icons = {
  Trophy: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
  )
};

const HomeScreen: React.FC<HomeScreenProps> = ({ user, onTaskSelect, onWorkSelect, onOpenNotifications }) => {
  const [activeTab, setActiveTab] = useState<MainTab>('tasks');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Все');
  
  const categories: Category[] = ['Все', 'UI/UX', 'Графика', 'Иллюстрация', 'Логотипы'];
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;

  const enhancedTasks: Task[] = MOCK_TASKS.map((t, idx) => {
    if (idx === 0) return { ...t, isFeatured: true, isPremium: true, challenge: { type: 'speed' as const, label: 'Speed Demon', reward: '+100 Stars' } };
    if (idx === 1) return { ...t, minLevel: 3, challenge: { type: 'bonus' as const, label: 'Double XP', reward: 'x2 Experience' } };
    return t;
  });

  const filteredTasks = enhancedTasks.filter(task => 
    selectedCategory === 'Все' || task.category === selectedCategory
  );

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex justify-between items-center animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex flex-col">
          <h2 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Твой AVYX Beta</h2>
          <div className="flex items-center gap-4 mt-1">
            <button 
              onClick={() => setActiveTab('tasks')}
              className={`text-2xl font-black transition-all ${activeTab === 'tasks' ? 'text-gray-900 scale-100' : 'text-gray-300 scale-90'}`}
            >
              Задания
            </button>
            <div className="w-1.5 h-1.5 rounded-full bg-orange-100 mt-2"></div>
            <button 
              onClick={() => setActiveTab('showcase')}
              className={`text-2xl font-black transition-all ${activeTab === 'showcase' ? 'text-gray-900 scale-100' : 'text-gray-300 scale-90'}`}
            >
              Шоукейс
            </button>
          </div>
        </div>
        <button 
          onClick={onOpenNotifications}
          className="bg-white p-3 rounded-2xl shadow-sm border border-gray-50 active:scale-90 transition-transform relative"
        >
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
           {unreadCount > 0 && (
             <div className="absolute top-2 right-2 w-2 h-2 bg-[#FF7F50] rounded-full border-2 border-white"></div>
           )}
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
         <div className="bg-white p-4 rounded-[32px] border border-gray-50 shadow-sm flex items-center gap-3 min-w-[160px]">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#FF7F50] flex items-center justify-center font-black text-xs shadow-inner">
              {user.isPro ? '∞' : `${user.proposalsLeft}/${user.maxProposals}`}
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Фокус</span>
              <span className="text-[10px] font-black text-gray-700">Энергия</span>
            </div>
         </div>
         <div className="bg-white p-4 rounded-[32px] border border-gray-50 shadow-sm flex items-center gap-3 min-w-[140px]">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center font-black text-xs">
              {user.xp}
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Опыт</span>
              <span className="text-[10px] font-black text-gray-700">Lvl {user.level}</span>
            </div>
         </div>
      </div>

      {activeTab === 'tasks' && (
        <div className="space-y-4">
           <div className="flex justify-between items-center ml-1">
             <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Топ талантов недели</h3>
           </div>
           <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-4 px-4 pb-2">
              {MOCK_USERS.map(u => (
                <div key={u.nickname} className="flex flex-col items-center gap-2 min-w-[80px]">
                   <Avatar src={u.avatar} type="designer" size="md" hasGlow={u.rating > 4.8} isDiamond={u.rating > 4.8} />
                   <span className="text-[9px] font-black text-gray-900">@{u.nickname}</span>
                </div>
              ))}
           </div>
        </div>
      )}

      <div className="sticky top-2 z-40 bg-[#FDFCFB]/80 backdrop-blur-md -mx-4 px-4 py-2">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl whitespace-nowrap text-[10px] font-black uppercase tracking-wider transition-all border ${
                selectedCategory === cat 
                  ? 'bg-[#FF7F50] text-white border-transparent shadow-md shadow-orange-100' 
                  : 'bg-white text-gray-400 border-gray-50 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'tasks' ? (
        <section className="space-y-6 animate-in fade-in duration-300">
          <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] ml-1">
            Свежие контракты
          </h3>
          
          <div className="space-y-6">
            {filteredTasks.map((task) => (
              <div 
                key={task.id} 
                onClick={() => onTaskSelect(task)}
                className={`bg-white rounded-[40px] p-6 shadow-sm border transition-all active:scale-[0.98] group relative ${task.isFeatured ? 'border-[#FF7F50] shadow-xl shadow-orange-50' : 'border-gray-100'}`}
              >
                {task.challenge && (
                  <div className="absolute -top-3 right-8 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg z-10 flex items-center gap-1.5 border-2 border-white">
                    <Icons.Trophy />
                    {task.challenge.label}: {task.challenge.reward}
                  </div>
                )}

                <div className="relative mb-5 overflow-hidden rounded-[32px] h-52">
                  <SmartImage src={task.image} alt={task.title} containerClassName="w-full h-full" className="transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 left-4">
                     <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl text-[9px] font-black uppercase text-[#FF7F50] shadow-sm">
                       {task.category}
                     </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-start pr-2">
                    <h3 className="font-black text-xl leading-tight group-hover:text-[#FF7F50] transition-colors">{task.title}</h3>
                  </div>
                  
                  <div className="flex items-center justify-between pt-5 border-t border-gray-50 mt-5">
                    <div className="flex items-center gap-3">
                      <Avatar src={`https://i.pravatar.cc/100?u=${task.author}`} type={task.authorType} size="sm" />
                      <div className="flex flex-col">
                        <span className="text-xs font-black">{task.author}</span>
                        <span className="text-[9px] text-gray-300 font-black uppercase tracking-tighter">Заказчик • {task.authorRating} ★</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-[#FF7F50] leading-none">{task.budget}</div>
                      <span className="text-[9px] text-gray-300 font-black uppercase">Срок: {task.deadline}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center ml-1">
             <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Работы недели</h3>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {MOCK_SHOWCASE.map((work) => (
              <div 
                key={work.id} 
                onClick={() => onWorkSelect(work)}
                className="bg-white rounded-[48px] overflow-hidden shadow-xl shadow-gray-100 border border-gray-50 group transition-all active:scale-[0.98]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <SmartImage src={work.image} alt={work.title} containerClassName="w-full h-full" className="transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10">
                     <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white">
                        <Avatar src={work.authorAvatar} type="designer" size="sm" className="scale-75" />
                        <span className="text-[10px] font-black uppercase tracking-widest">@{work.author}</span>
                     </div>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                   <h4 className="font-black text-sm uppercase tracking-tight">{work.title}</h4>
                   <div className="flex items-center gap-3 text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        <span className="text-[10px] font-bold">{work.views}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                        <span className="text-[10px] font-bold">{work.likes}</span>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomeScreen;
