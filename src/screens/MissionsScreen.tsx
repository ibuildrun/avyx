
import React from 'react';
import { Mission, Sprint } from '../types';
import { LEADERBOARD, MOCK_SPRINT } from '../constants';

interface MissionsScreenProps {
  missions: Mission[];
  onSprintOpen: () => void;
}

const Icons = {
  Fire: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
  ),
  Target: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  ),
  Check: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Rocket: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
  ),
  Crown: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z"/></svg>
  ),
  Trophy: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
  )
};

const MissionsScreen: React.FC<MissionsScreenProps> = ({ missions, onSprintOpen }) => {
  return (
    <div className="p-4 space-y-8 pb-10">
      {/* Daily Streak Section */}
      <div className="coral-gradient p-6 rounded-[32px] text-white shadow-lg shadow-orange-100 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 text-white opacity-10">
           <svg width="140" height="140" viewBox="0 0 24 24" fill="currentColor"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
        </div>
        <div className="relative flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black mb-1">5 Дней в огне!</h2>
            <p className="text-white/80 text-xs">Заходи каждый день для бонусов</p>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/30 text-center flex flex-col items-center">
            <span className="text-white mb-0.5"><Icons.Fire /></span>
            <span className="text-xl font-black block leading-none">5</span>
            <span className="text-[8px] font-black uppercase tracking-widest mt-0.5">Дней</span>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7].map(day => (
            <div key={day} className={`flex-1 h-2 rounded-full ${day <= 5 ? 'bg-white' : 'bg-white/30'}`}></div>
          ))}
        </div>
      </div>

      {/* Social Gamification: Design Sprint Card */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] ml-1">Спринт дня</h3>
        <button 
          onClick={onSprintOpen}
          className="w-full bg-white p-6 rounded-[40px] border border-gray-50 shadow-sm text-left relative overflow-hidden group active:scale-[0.98] transition-all"
        >
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full group-hover:scale-125 transition-transform duration-700"></div>
           <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-[#FF7F50]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#FF7F50] uppercase tracking-widest leading-none mb-1">Ежедневный вызов</span>
                    <h4 className="font-black text-lg leading-none tracking-tight">{MOCK_SPRINT.title}</h4>
                 </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                 <div className="flex -space-x-2">
                    {MOCK_SPRINT.submissions.map((s, idx) => (
                       <div key={s.id} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-gray-100">
                          <img src={s.userAvatar} className="w-full h-full object-cover" />
                       </div>
                    ))}
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[8px] font-black text-gray-300">
                       +8
                    </div>
                 </div>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Голосуй или рисуй →</span>
              </div>
           </div>
        </button>
      </section>

      {/* Quests Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-black px-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#FF7F50]"><Icons.Target /></span>
            Задания
          </div>
          <span className="text-[10px] text-[#FF7F50] font-black underline uppercase tracking-wider">Все квесты</span>
        </h3>
        <div className="space-y-4">
          {missions.map(mission => (
            <div key={mission.id} className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${mission.isCompleted ? 'bg-[#A7FFEB]/20 text-[#00c5a1]' : 'bg-gray-50 text-[#FF7F50]'}`}>
                {mission.isCompleted ? <Icons.Check /> : <Icons.Rocket />}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm leading-tight mb-1">{mission.title}</h4>
                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-2">{mission.reward}</div>
                <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF7F50] rounded-full" style={{ width: `${mission.progress}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-black px-1 flex items-center gap-2">
          <span className="text-[#FF7F50]"><Icons.Trophy /></span>
          Топ Дизайнеров
        </h3>
        <div className="bg-white rounded-[32px] border border-gray-50 shadow-sm overflow-hidden">
          {LEADERBOARD.map((item, idx) => (
            <div key={item.name} className={`flex items-center gap-4 p-4 ${idx !== LEADERBOARD.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <div className="w-6 text-center font-black text-[#FF7F50]">{item.rank}</div>
              <img src={item.avatar} className="w-10 h-10 rounded-full border border-gray-100" />
              <div className="flex-1">
                <div className="font-bold text-sm">{item.name}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{item.xp} XP</div>
              </div>
              {idx === 0 && <span className="text-[#FFC107]"><Icons.Crown /></span>}
            </div>
          ))}
          <div className="bg-orange-50/50 p-4 text-center border-t border-orange-100/50">
             <p className="text-[10px] font-black text-[#FF7F50] uppercase tracking-[0.2em]">
               Твое место в топе: #42
             </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MissionsScreen;
