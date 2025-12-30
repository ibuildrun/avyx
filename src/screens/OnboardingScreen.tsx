import React, { useState } from 'react';
import { User, UserType } from '../types';

interface OnboardingScreenProps {
  onComplete: (userData: Partial<User>) => void;
}

type Step = 'welcome' | 'role' | 'details' | 'finish';

const Icons = {
  Palette: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a8 8 0 1 0-8-8c0 1.5 1.5 3 3 3h1c1.5 0 3 1.5 3 3v1Z"/><path d="M9 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/><path d="M15 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/><path d="M12 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/></svg>
  ),
  Rocket: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
  ),
  User: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  ),
  Briefcase: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
  ),
  Check: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Sparkles: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 1.912 4.912L18.824 9.824 13.912 11.736 12 16.648l-1.912-4.912L5.176 9.824l4.912-1.912L12 3z"/><path d="m5 3 1 2.5L8.5 7 6 8 5 10.5 4 8 1.5 7 4 5.5 5 3z"/><path d="m19 14 1 2.5 2.5 1.5-2.5 1-1 2.5-1-2.5-2.5-1.5 2.5-1 1-2.5z"/></svg>
  )
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<Step>('welcome');
  const [role, setRole] = useState<'designer' | 'client' | null>(null);
  const [type, setType] = useState<UserType>('designer');
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [specialty, setSpecialty] = useState('');

  const handleFinish = () => {
    onComplete({ role: role || 'designer', type, name: name || nickname, nickname, specialty });
  };

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-between h-full p-6 text-center animate-in fade-in duration-700">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <div className="space-y-4">
          <div className="w-20 h-20 coral-gradient rounded-[28px] mx-auto shadow-2xl shadow-orange-200 flex items-center justify-center text-white text-3xl font-black italic">A</div>
          <h1 className="text-3xl font-black tracking-tighter">AVYX <span className="text-[#FF7F50]">Beta</span></h1>
          <p className="text-gray-400 font-medium text-sm px-4">Твое творческое пространство для роста и заработка</p>
        </div>
        <div className="space-y-3 w-full">
          <div className="p-4 bg-white rounded-2xl border border-gray-50 shadow-sm text-left flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF7F50]"><Icons.Palette /></div>
            <div><h3 className="font-bold text-sm">Найди заказы</h3><p className="text-[10px] text-gray-400 font-bold uppercase">От логотипов до UI/UX</p></div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-gray-50 shadow-sm text-left flex items-center gap-3">
            <div className="w-10 h-10 bg-[#A7FFEB]/20 rounded-xl flex items-center justify-center text-teal-600"><Icons.Rocket /></div>
            <div><h3 className="font-bold text-sm">Прокачай скиллы</h3><p className="text-[10px] text-gray-400 font-bold uppercase">Выполняй квесты и миссии</p></div>
          </div>
        </div>
      </div>
      <div className="w-full space-y-3 pb-4">
        <button onClick={() => setStep('role')} className="w-full coral-gradient text-white py-4 rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-orange-200 active:scale-95 transition-all">Начать путь</button>
        <p className="text-[10px] text-gray-300 font-medium">@avyx_robot</p>
      </div>
    </div>
  );

  const renderRoleSelection = () => (
    <div className="flex flex-col items-center justify-between h-full p-6 animate-in slide-in-from-right duration-500">
      <div className="text-center space-y-2 pt-8">
        <h2 className="text-2xl font-black tracking-tight">Кто ты в мире дизайна?</h2>
        <p className="text-gray-400 text-sm">Это поможет нам подобрать лучший контент</p>
      </div>
      <div className="grid grid-cols-1 gap-3 w-full flex-1 py-6 content-center">
        <button onClick={() => { setRole('designer'); setType('designer'); setStep('details'); }} className="group p-6 bg-white rounded-[32px] border-2 border-transparent hover:border-[#FF7F50] shadow-xl shadow-gray-100 text-left transition-all active:scale-95 flex items-center justify-between">
          <div className="space-y-2"><div className="text-[#FF7F50]"><Icons.User /></div><h3 className="text-lg font-black">Я Дизайнер</h3><p className="text-xs text-gray-400 font-medium">Ищу заказы и хочу расти</p></div>
          <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-[#FF7F50] transition-colors flex items-center justify-center text-gray-300 group-hover:text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6"/></svg></div>
        </button>
        <button onClick={() => { setRole('client'); setType('entrepreneur'); setStep('details'); }} className="group p-6 bg-white rounded-[32px] border-2 border-transparent hover:border-[#A7FFEB] shadow-xl shadow-gray-100 text-left transition-all active:scale-95 flex items-center justify-between">
          <div className="space-y-2"><div className="text-teal-500"><Icons.Briefcase /></div><h3 className="text-lg font-black">Я Заказчик</h3><p className="text-xs text-gray-400 font-medium">Ищу таланты для бизнеса</p></div>
          <div className="w-10 h-10 rounded-full bg-gray-50 group-hover:bg-[#A7FFEB] transition-colors flex items-center justify-center text-gray-300 group-hover:text-white"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6"/></svg></div>
        </button>
      </div>
      <button onClick={() => setStep('welcome')} className="text-gray-300 font-bold uppercase text-[10px] tracking-widest pb-4">Вернуться назад</button>
    </div>
  );

  const renderDetails = () => (
    <div className="flex flex-col h-full p-6 animate-in slide-in-from-right duration-500">
      <div className="space-y-2 pt-4">
        <h2 className="text-2xl font-black tracking-tight">Почти готово!</h2>
        <p className="text-gray-400 text-sm">Расскажи немного о себе</p>
      </div>
      <div className="space-y-4 py-6 flex-1">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Как тебя называть?</label>
          <input type="text" placeholder="Твое имя или название компании" className="w-full p-4 bg-white rounded-2xl shadow-sm border-none focus:ring-2 focus:ring-[#FF7F50]/20 outline-none font-bold text-sm" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Твой @никнейм</label>
          <input type="text" placeholder="Напр. designer_pro" className="w-full p-4 bg-white rounded-2xl shadow-sm border-none focus:ring-2 focus:ring-[#FF7F50]/20 outline-none font-bold text-sm" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        </div>
        {role === 'designer' ? (
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Специализация</label>
            <div className="flex flex-wrap gap-2">
              {['UI/UX', 'Логотипы', 'Иллюстрация', 'Графика'].map(s => (
                <button key={s} onClick={() => setSpecialty(s)} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border ${specialty === s ? 'bg-[#FF7F50] text-white border-transparent' : 'bg-white text-gray-400 border-gray-50 shadow-sm'}`}>{s}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Тип заказчика</label>
            <div className="grid grid-cols-2 gap-2">
              {[{id: 'entrepreneur', label: 'Предприниматель'}, {id: 'company', label: 'Компания'}].map(t => (
                <button key={t.id} onClick={() => setType(t.id as UserType)} className={`p-3 rounded-2xl text-[10px] font-black uppercase transition-all border ${type === t.id ? 'bg-[#A7FFEB] text-teal-800 border-transparent' : 'bg-white text-gray-400 border-gray-50 shadow-sm'}`}>{t.label}</button>
              ))}
            </div>
          </div>
        )}
      </div>
      <button onClick={() => setStep('finish')} disabled={!nickname || !name} className="w-full coral-gradient text-white py-4 rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-orange-200 active:scale-95 transition-all disabled:opacity-50 mb-4">Создать профиль</button>
    </div>
  );

  const renderFinish = () => (
    <div className="flex flex-col items-center justify-between h-full p-6 text-center animate-in zoom-in duration-500">
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="text-[#FF7F50] animate-pulse"><Icons.Sparkles /></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 coral-gradient rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white"><Icons.Check /></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight italic text-[#FF7F50]">Великолепно!</h2>
          <p className="text-gray-400 font-medium text-sm px-4">Твой профиль готов. Добро пожаловать в семью AVYX.</p>
        </div>
        <div className="w-full p-6 bg-white rounded-[32px] shadow-2xl shadow-gray-100 border border-gray-50 space-y-3">
           <div className="flex items-center gap-3 text-left">
              <div className="w-14 h-14 coral-gradient rounded-xl flex items-center justify-center text-white text-xl font-black">{name.charAt(0)}</div>
              <div><h3 className="text-lg font-black">{name}</h3><p className="text-sm text-gray-400 font-bold">@{nickname}</p></div>
           </div>
           <div className="h-px bg-gray-50 w-full"></div>
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-gray-300 uppercase">Статус</span>
              <span className="text-[10px] font-black text-[#FF7F50] uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">Newbie Lvl 1</span>
           </div>
        </div>
      </div>
      <button onClick={handleFinish} className="w-full coral-gradient text-white py-4 rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-orange-200 active:scale-95 transition-all mb-4">Войти в ленту</button>
    </div>
  );

  switch (step) {
    case 'welcome': return renderWelcome();
    case 'role': return renderRoleSelection();
    case 'details': return renderDetails();
    case 'finish': return renderFinish();
    default: return renderWelcome();
  }
};

export default OnboardingScreen;
