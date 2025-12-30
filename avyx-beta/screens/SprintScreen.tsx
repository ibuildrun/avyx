
import React, { useState, useEffect } from 'react';
import { Sprint, User, SprintSubmission } from '../types';
import Avatar from '../components/Avatar';
import SmartImage from '../components/SmartImage';

interface SprintScreenProps {
  sprint: Sprint;
  user: User;
  onBack: () => void;
  onParticipate: () => void;
}

const SprintScreen: React.FC<SprintScreenProps> = ({ sprint, user, onBack, onParticipate }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const end = new Date(sprint.endsAt).getTime();
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        clearInterval(timer);
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [sprint.endsAt]);

  const hasParticipated = sprint.submissions.some(s => s.userId === user.nickname); // Mock check

  return (
    <div className="bg-[#FDFCFB] min-h-screen pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="p-6 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-50 active:scale-90 transition-transform">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-xl font-black uppercase tracking-tight">Спринт дня</h1>
        <div className="w-10"></div>
      </div>

      <div className="px-6 space-y-8 mt-4">
        {/* Challenge Card */}
        <div className="coral-gradient p-8 rounded-[48px] text-white shadow-xl shadow-orange-100 space-y-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="space-y-2 relative z-10">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md">Активен</span>
              <div className="flex items-center gap-2">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                 <span className="text-xs font-black font-mono">{timeLeft}</span>
              </div>
            </div>
            <h2 className="text-3xl font-black leading-tight">{sprint.title}</h2>
            <p className="text-white/80 text-sm leading-relaxed">{sprint.description}</p>
          </div>

          <div className="pt-2">
            {!hasParticipated ? (
              <button 
                onClick={onParticipate}
                className="w-full bg-white text-[#FF7F50] py-5 rounded-[28px] font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all"
              >
                Участвовать (15 мин)
              </button>
            ) : (
              <div className="text-center py-4 bg-white/20 rounded-[28px] border border-white/30 backdrop-blur-md">
                 <span className="text-[10px] font-black uppercase tracking-widest">Твоя работа принята ✨</span>
              </div>
            )}
          </div>
        </div>

        {/* Submissions Gallery */}
        <section className="space-y-6">
           <div className="flex justify-between items-center ml-1">
              <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Работы участников ({sprint.submissions.length})</h3>
              <span className="text-[9px] font-black text-[#FF7F50] uppercase tracking-widest">Голосование открыто</span>
           </div>

           <div className="grid grid-cols-2 gap-4">
              {sprint.submissions.map((sub) => (
                <div key={sub.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 group animate-in zoom-in duration-300">
                  <div className="aspect-square relative overflow-hidden">
                     <SmartImage src={sub.image} containerClassName="w-full h-full" className="group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute top-2 left-2 bg-black/30 backdrop-blur-md p-1.5 rounded-full border border-white/20">
                        <Avatar src={sub.userAvatar} type="designer" size="sm" className="scale-75" />
                     </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                     <span className="text-[10px] font-black text-gray-400 truncate w-24">@{sub.userNickname}</span>
                     <button className="flex items-center gap-1.5 group/btn">
                        <span className="text-[10px] font-black text-gray-400 group-hover/btn:text-red-500 transition-colors">{sub.likes}</span>
                        <svg className="text-gray-200 group-hover/btn:text-red-500 transition-all" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                     </button>
                  </div>
                </div>
              ))}
           </div>
        </section>

        {/* Info */}
        <div className="bg-indigo-50 p-6 rounded-[32px] border border-indigo-100 text-center space-y-2">
           <div className="text-2xl">🏆</div>
           <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Приз за победу</h4>
           <p className="text-[9px] text-indigo-700 font-medium">Статус "Герой дня", уникальная аура в профиле на 24ч и +200 XP</p>
        </div>
      </div>
    </div>
  );
};

export default SprintScreen;
