
import React, { useState, useEffect } from 'react';
import { User, Mood } from '../types';
import { MOOD_OPTIONS } from '../constants';
import Avatar from '../components/Avatar';
import SmartImage from '../components/SmartImage';
import { api } from '../api/client';

interface ProfileScreenProps {
  user: User;
  onEdit: () => void;
  onOpenMarketplace: () => void;
  onAddWork: () => void;
  onUpdateUser: (user: User) => void;
  onOpenAdmin?: () => void;
}

const Icons = {
  Sparkle: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 1.912 4.912L18.824 9.824 13.912 11.736 12 16.648l-1.912-4.912L5.176 9.824l4.912-1.912L12 3z"/><path d="m5 3 1 2.5L8.5 7 6 8 5 10.5 4 8 1.5 7 4 5.5 5 3z"/><path d="m19 14 1 2.5 2.5 1.5-2.5 1-1 2.5-1-2.5-2.5-1.5 2.5-1 1-2.5z"/></svg>
  ),
  Bolt: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
  ),
  Shield: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Plus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  Sprout: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4.2.9-4.9 2z"/></svg>
  ),
  BadgeIcons: {
    fire: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>,
    zap: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    palette: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-5-8a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm10 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-5-4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>,
    star: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    code: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  }
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onEdit, onOpenMarketplace, onAddWork, onUpdateUser, onOpenAdmin }) => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'works' | 'garden' | 'reviews' | 'about'>('achievements');
  const [isMoodPickerOpen, setIsMoodPickerOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    api.admin.checkAccess().then(res => {
      if (res.success && res.data?.isAdmin) {
        setIsAdmin(true);
      }
    });
  }, []);

  const mockReviews = [
    { 
      id: 'r1', 
      user: 'Мария С.', 
      text: 'Просто невероятно! Понимание стиля с полуслова.', 
      tag: 'Вдохновляюще', 
      tagType: 'inspiring',
      rating: 5 
    }
  ];

  const getGardenItems = () => {
    const items = [];
    const count = Math.floor(user.totalEarnings / 1000);
    
    for (let i = 0; i < count; i++) {
      if (i % 50 === 0 && i > 0) items.push('🌳');
      else if (i % 10 === 0 && i > 0) items.push('🌹');
      else if (i % 5 === 0 && i > 0) items.push('🌷');
      else items.push('🌼');
    }
    return items;
  };

  const handleMoodSelect = (mood: Mood) => {
    onUpdateUser({ ...user, mood });
    setIsMoodPickerOpen(false);
  };

  const gardenProgress = ((user.totalEarnings % 1000) / 1000) * 100;

  return (
    <div className="space-y-6 bg-[#FDFCFB] min-h-screen pb-10 relative">
      {/* Header Profile Section */}
      <div className="relative">
        <div 
          className="h-64 w-full rounded-b-[64px] relative overflow-hidden transition-all duration-700 shadow-xl"
          style={{ 
            background: user.bannerImage ? `url(${user.bannerImage}) center/cover no-repeat` : 'linear-gradient(135deg, #FF7F50 0%, #FF6B6B 100%)' 
          }}
        >
           {user.bannerImage && <div className="absolute inset-0 bg-black/30"></div>}
           <div className="absolute top-6 right-6 flex gap-3 z-10">
              {isAdmin && onOpenAdmin && (
                <button 
                  onClick={onOpenAdmin}
                  className="p-3 bg-red-500/80 backdrop-blur-md rounded-2xl border border-white/30 text-white active:scale-90 transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </button>
              )}
              <button 
                onClick={onOpenMarketplace}
                className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white active:scale-90 transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.56-7.43a1 1 0 0 0-1-1.22h-14.73"/></svg>
              </button>
              <button 
                onClick={onEdit}
                className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-white active:scale-90 transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
              </button>
           </div>
        </div>
        
        <div className="px-6 -mt-24 text-center space-y-4 relative z-10">
          <div className="relative inline-block">
            <div 
              className="absolute inset-0 avatar-diamond scale-[1.25] shadow-2xl transition-colors duration-300"
              style={{ backgroundColor: user.avatarBorderColor || '#FFFFFF' }}
            ></div>
            
            <Avatar 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400" 
              type={user.type} 
              size="xl" 
              isDiamond={true}
              hasGlow={user.isPro || user.level > 1}
              className="mx-auto" 
            />
            
            <div className="absolute -bottom-4 -right-4 coral-gradient text-white w-12 h-12 rounded-full flex items-center justify-center text-sm font-black border-4 border-[#FDFCFB] shadow-xl">
              {user.level}
            </div>

            {user.hasShield && (
              <div className="absolute -bottom-4 -left-4 bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#FDFCFB] shadow-lg">
                <Icons.Shield />
              </div>
            )}
            
            {/* Mood Trigger */}
            <button 
              onClick={() => setIsMoodPickerOpen(true)}
              className="absolute -top-4 -right-4 bg-white p-2.5 rounded-2xl shadow-xl border border-gray-100 flex items-center justify-center transition-all hover:scale-110 active:scale-90"
              style={{ backgroundColor: user.mood?.bg || 'white' }}
            >
              <span className="text-xl">{user.mood?.emoji || '☁️'}</span>
              {isMoodPickerOpen && <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF7F50] rounded-full animate-ping"></div>}
            </button>
          </div>
          
          <div className="space-y-1 pt-4">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-black tracking-tight">@{user.nickname} {user.isPro && <span className="text-[#FF7F50]">PRO</span>}</h2>
              {user.mood && (
                 <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full animate-in fade-in duration-300" style={{ backgroundColor: user.mood.bg, color: user.mood.color }}>
                    {user.mood.label}
                 </span>
              )}
            </div>
            <div className="inline-flex items-center gap-2 bg-orange-50 px-4 py-1.5 rounded-full">
              <span className="text-[10px] font-black text-[#FF7F50] uppercase tracking-widest">{user.specialty}</span>
            </div>
          </div>

          <div className="flex justify-center gap-8 py-2">
            <div className="text-center">
              <div className="font-black text-xl">{user.completedTasks}</div>
              <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Проектов</div>
            </div>
            <div className="text-center">
              <div className="font-black text-xl text-[#FF7F50]">{user.rating}</div>
              <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Рейтинг</div>
            </div>
            <div className="text-center">
              <div className="font-black text-xl">{user.streak}д.</div>
              <div className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Стрик</div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="px-10 space-y-3">
             <div className="flex justify-between items-center text-[9px] font-black uppercase text-gray-400 tracking-widest">
                <span>Прогресс до Lvl {user.level + 1}</span>
                <span>{user.xp} / {user.nextLevelXp} XP</span>
             </div>
             <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full coral-gradient transition-all duration-1000" style={{ width: `${(user.xp / user.nextLevelXp) * 100}%` }}></div>
             </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 flex gap-8 border-b border-gray-100 overflow-x-auto hide-scrollbar">
        <button onClick={() => setActiveTab('achievements')} className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative transition-colors whitespace-nowrap ${activeTab === 'achievements' ? 'text-[#FF7F50]' : 'text-gray-400'}`}>
          Эмблемы {activeTab === 'achievements' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF7F50] rounded-t-full"></div>}
        </button>
        <button onClick={() => setActiveTab('works')} className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative transition-colors whitespace-nowrap ${activeTab === 'works' ? 'text-[#FF7F50]' : 'text-gray-400'}`}>
          Портфолио {activeTab === 'works' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF7F50] rounded-t-full"></div>}
        </button>
        <button onClick={() => setActiveTab('garden')} className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative transition-colors whitespace-nowrap ${activeTab === 'garden' ? 'text-[#FF7F50]' : 'text-gray-400'}`}>
          Сад {activeTab === 'garden' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF7F50] rounded-t-full"></div>}
        </button>
        <button onClick={() => setActiveTab('reviews')} className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative transition-colors whitespace-nowrap ${activeTab === 'reviews' ? 'text-[#FF7F50]' : 'text-gray-400'}`}>
          Отзывы {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF7F50] rounded-t-full"></div>}
        </button>
        <button onClick={() => setActiveTab('about')} className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative transition-colors whitespace-nowrap ${activeTab === 'about' ? 'text-[#FF7F50]' : 'text-gray-400'}`}>
          О себе {activeTab === 'about' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF7F50] rounded-t-full"></div>}
        </button>
      </div>

      {/* Content */}
      <div className="px-6 pb-12">
        {activeTab === 'achievements' && (
           <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-500">
              {user.badges.map(badge => (
                <div 
                  key={badge.id} 
                  className={`p-5 rounded-[32px] border bg-white flex flex-col items-center text-center space-y-3 transition-all ${badge.isUnlocked ? 'border-gray-100 shadow-sm' : 'border-gray-50 opacity-40 grayscale'}`}
                >
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gray-50 ${badge.color}`}>
                      {Icons.BadgeIcons[badge.icon as keyof typeof Icons.BadgeIcons]()}
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase tracking-tight leading-none">{badge.name}</h4>
                      <p className="text-[8px] font-bold text-gray-400 leading-tight pr-1 pl-1">{badge.description}</p>
                   </div>
                </div>
              ))}
           </div>
        )}

        {activeTab === 'works' && (
           <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                 <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-1">Мои работы ({user.portfolio.length})</h3>
                 <button 
                  onClick={onAddWork}
                  className="flex items-center gap-2 text-[#FF7F50] font-black text-[10px] uppercase tracking-widest"
                 >
                   <Icons.Plus />
                   Добавить
                 </button>
              </div>

              {user.portfolio.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                   {user.portfolio.map(item => (
                     <div key={item.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 group">
                        <div className="aspect-square relative overflow-hidden">
                           <SmartImage src={item.image} containerClassName="w-full h-full" className="group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="p-3">
                           <h4 className="text-[10px] font-black uppercase tracking-tight truncate">{item.title}</h4>
                           <div className="flex items-center gap-2 mt-1 opacity-40">
                              <span className="text-[8px] font-black">{item.likes} ❤️</span>
                              <span className="text-[8px] font-black">{item.views} 👁️</span>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              ) : (
                <div className="bg-white p-10 rounded-[48px] border-2 border-dashed border-gray-100 text-center space-y-4 shadow-sm">
                  <span className="text-4xl block">🎨</span>
                  <h3 className="font-black text-sm uppercase tracking-tight">Пора сиять!</h3>
                  <p className="text-gray-400 text-xs font-medium">Загрузи свои кейсы, чтобы попасть в рекомендации</p>
                  <button 
                    onClick={onAddWork}
                    className="coral-gradient text-white px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-100 active:scale-95 transition-all"
                  >
                    Добавить работу
                  </button>
                </div>
              )}
           </div>
        )}

        {activeTab === 'garden' && (
           <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-emerald-50/50 p-6 rounded-[40px] border border-emerald-100 space-y-4 text-center">
                 <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-emerald-500 mx-auto shadow-sm">
                    <Icons.Sprout />
                 </div>
                 <div className="space-y-1">
                    <h3 className="text-lg font-black tracking-tight text-emerald-900">Сад Достижений</h3>
                    <p className="text-xs text-emerald-700 font-medium">Каждые 1,000₽ дохода выращивают новый цветок в твоем профиле ✨</p>
                 </div>
                 
                 <div className="pt-2 space-y-3">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-emerald-800 tracking-widest">
                       <span>До нового цветка</span>
                       <span>{user.totalEarnings % 1000} / 1000 ₽</span>
                    </div>
                    <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner">
                       <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: `${gardenProgress}%` }}></div>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[48px] border border-gray-50 shadow-sm min-h-[300px]">
                 <div className="grid grid-cols-5 gap-4">
                    {getGardenItems().map((emoji, idx) => (
                      <div 
                        key={idx} 
                        className="aspect-square flex items-center justify-center text-2xl hover:scale-125 transition-transform cursor-pointer animate-in zoom-in duration-300"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                         {emoji}
                      </div>
                    ))}
                    {getGardenItems().length === 0 && (
                      <div className="col-span-5 py-12 text-center space-y-3 opacity-30">
                         <div className="text-4xl">🌱</div>
                         <p className="text-[10px] font-black uppercase tracking-widest">Твой сад ждет первых побед</p>
                      </div>
                    )}
                 </div>
              </div>

              <div className="text-center">
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Общий доход: {user.totalEarnings.toLocaleString()} ₽</p>
              </div>
           </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4 animate-in fade-in duration-500">
             {mockReviews.map(review => (
                <div key={review.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="font-black text-sm">{review.user}</span>
                      <div className="flex gap-0.5">
                         {[1,2,3,4,5].map(i => <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i <= review.rating ? "#FFD700" : "none"} stroke="#FFD700" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}
                      </div>
                   </div>
                   <p className="text-gray-500 text-xs font-medium leading-relaxed">{review.text}</p>
                   <span className="inline-flex items-center gap-2 bg-orange-50 text-[#FF7F50] px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest">
                     {review.tagType === 'inspiring' ? <Icons.Sparkle /> : <Icons.Bolt />}
                     {review.tag}
                   </span>
                </div>
             ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-50 animate-in fade-in duration-500">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 coral-gradient rounded-xl flex items-center justify-center text-white">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                </div>
                <h3 className="font-black text-sm uppercase tracking-widest">Твоя история</h3>
             </div>
             {user.about ? (
               <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {user.about}
               </p>
             ) : (
               <div className="text-center py-6 space-y-4">
                  <p className="text-gray-400 text-xs font-medium">Тут пока пусто. Расскажи о своем опыте и стиле в настройках!</p>
                  <button 
                    onClick={onEdit}
                    className="text-[#FF7F50] text-[10px] font-black uppercase underline tracking-widest"
                  >
                    Заполнить профиль
                  </button>
               </div>
             )}
          </div>
        )}
      </div>

      {/* Mood Picker Overlay */}
      {isMoodPickerOpen && (
         <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMoodPickerOpen(false)}></div>
            <div className="relative w-full max-w-[428px] bg-white rounded-t-[48px] p-8 shadow-2xl animate-in slide-in-from-bottom duration-500">
               <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8"></div>
               <h3 className="text-xl font-black text-center mb-8 tracking-tight uppercase">Как ты сегодня? ✨</h3>
               <div className="grid grid-cols-3 gap-4">
                  {MOOD_OPTIONS.map((mood) => (
                     <button 
                        key={mood.label}
                        onClick={() => handleMoodSelect(mood)}
                        className="flex flex-col items-center gap-3 p-4 rounded-3xl transition-all active:scale-90 border border-transparent hover:border-gray-100"
                        style={{ backgroundColor: mood.bg }}
                     >
                        <span className="text-3xl">{mood.emoji}</span>
                        <span className="text-[9px] font-black uppercase tracking-tight text-center" style={{ color: mood.color }}>{mood.label}</span>
                     </button>
                  ))}
               </div>
               <button 
                  onClick={() => setIsMoodPickerOpen(false)}
                  className="w-full mt-8 py-4 text-gray-400 font-black uppercase text-[10px] tracking-widest"
               >
                  Закрыть
               </button>
            </div>
         </div>
      )}
    </div>
  );
};

export default ProfileScreen;
