
import React, { useState } from 'react';
import { Task, User } from '../types';
import Avatar from '../components/Avatar';
import SmartImage from '../components/SmartImage';
import ReportModal from '../components/ReportModal';

interface TaskDetailScreenProps {
  task: Task;
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  onBack: () => void;
}

type GameStatus = 'idle' | 'applying' | 'won' | 'lost' | 'submitted';

const Icons = {
  Zap: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
  ),
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
  ),
  Sparkles: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3 1.912 4.912L18.824 9.824 13.912 11.736 12 16.648l-1.912-4.912L5.176 9.824l4.912-1.912L12 3z"/><path d="m5 3 1 2.5L8.5 7 6 8 5 10.5 4 8 1.5 7 4 5.5 5 3z"/><path d="m19 14 1 2.5 2.5 1.5-2.5 1-1 2.5-1-2.5-2.5-1.5 2.5-1 1-2.5z"/></svg>
  ),
  Shield: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Flag: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
  )
};

const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({ task, user, onUpdateUser, onBack }) => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(user.appliedTasks?.includes(task.id) ? 'submitted' : 'idle');
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [showEscrowInfo, setShowEscrowInfo] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const generatePromoCode = () => Math.floor(10000 + Math.random() * 90000).toString();

  const parseBudget = (budgetString: string): number => {
    return parseInt(budgetString.replace(/[^0-9]/g, ''), 10) || 0;
  };

  const sendTelegramMessage = (message: string) => {
    console.log(`Telegram Bot: ${message}`);
  };

  const handleApply = () => {
    if (task.minLevel && user.level < task.minLevel) {
      alert(`Это задание доступно только с ${task.minLevel} уровня. Выполняйте квесты, чтобы расти!`);
      return;
    }

    if (task.isPremium && !user.isPro) {
      alert('Это задание доступно только для PRO пользователей.');
      return;
    }

    if (!user.isPro && user.proposalsLeft <= 0) {
      alert('У вас закончились отклики на сегодня. PRO статус дает безлимитные отклики!');
      return;
    }

    setGameStatus('applying');

    const delay = user.isPro ? 1200 : 2500;

    setTimeout(() => {
      const winProbability = user.isPro ? 0.6 : 0.3;
      const isWin = Math.random() < winProbability;

      if (isWin) {
        const code = generatePromoCode();
        setPromoCode(code);
        setGameStatus('won');
        sendTelegramMessage(`Victory! Promo code issued: ${code}`);
        
        const taskReward = parseBudget(task.budget);
        
        onUpdateUser({
          ...user,
          proposalsLeft: user.isPro ? user.proposalsLeft : Math.max(0, user.proposalsLeft - 1),
          xp: user.xp + 50,
          totalEarnings: (user.totalEarnings || 0) + taskReward,
          appliedTasks: [...(user.appliedTasks || []), task.id]
        });
      } else {
        setGameStatus('lost');
        sendTelegramMessage("Loss");
      }
    }, delay);
  };

  const handleEditProposal = () => {
    if (!user.isPro) {
      alert('Редактирование откликов доступно только PRO пользователям.');
      return;
    }
    alert('Редактирование открыто. Измените ваше портфолио или сообщение для заказчика.');
    setGameStatus('idle');
  };

  if (gameStatus === 'applying') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-[#FDFCFB]">
        <div className="w-28 h-28 relative mb-8">
          <div className="absolute inset-0 border-4 border-orange-100 border-t-[#FF7F50] rounded-[36px] animate-spin"></div>
          <div className="absolute inset-6 bg-white rounded-3xl flex items-center justify-center shadow-inner">
            <span className="text-4xl text-[#FF7F50] animate-pulse">✨</span>
          </div>
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight text-gray-800">
          {user.isPro ? 'Приоритетный выбор...' : 'Анализируем шансы...'}
        </h2>
        <p className="text-gray-400 mt-4 text-sm leading-relaxed max-w-xs mx-auto">
          AVYX сопоставляет твой уникальный стиль с ожиданиями клиента. Почти готово!
        </p>
      </div>
    );
  }

  if (gameStatus === 'lost') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-white animate-in zoom-in duration-500">
        <div className="text-7xl mb-8">🌸</div>
        <h1 className="text-4xl font-black text-[#FF7F50] mb-3 uppercase tracking-tighter italic">Почти!</h1>
        <p className="text-gray-400 mb-10 leading-relaxed text-sm font-medium px-4">
          В этот раз удача была совсем рядом. Настоящие таланты не сдаются — попробуем еще раз? ✨
        </p>
        
        <div className="w-full space-y-4">
          <button 
            onClick={() => setGameStatus('idle')}
            className="w-full coral-gradient text-white py-6 rounded-[32px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 active:scale-95 transition-all"
          >
            Играть снова
          </button>
          <button 
            onClick={onBack}
            className="w-full bg-gray-50 text-gray-400 py-4 rounded-[32px] font-black uppercase tracking-widest text-[10px]"
          >
            Вернуться к ленте
          </button>
        </div>
      </div>
    );
  }

  if (gameStatus === 'won') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center bg-white animate-in zoom-in duration-500">
        <div className="text-7xl mb-8 animate-bounce">💎</div>
        <h1 className="text-4xl font-black text-[#FF7F50] mb-3 uppercase tracking-tighter">Твой триумф!</h1>
        
        {/* Confirmed Escrow Notification */}
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-3xl mb-8 flex items-center gap-4 text-left max-w-xs animate-in slide-in-from-top duration-700 delay-300">
           <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm flex-shrink-0">
              <Icons.Shield />
           </div>
           <p className="text-[10px] text-indigo-900 font-bold leading-tight">
             <span className="uppercase block mb-0.5">Средства защищены</span>
             Бюджет задачи ({task.budget}) успешно заморожен системой AVYX. Работайте спокойно!
           </p>
        </div>

        <p className="text-gray-400 mb-10 leading-relaxed text-sm font-medium px-4">
          Твой отклик признан лучшим! Мы уже шепнули заказчику о твоем таланте. Твой сад достижений растет!
        </p>
        
        <div className="w-full bg-orange-50 border-2 border-dashed border-[#FF7F50] p-10 rounded-[48px] mb-12 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 text-[#FF7F50]/10 group-hover:rotate-12 transition-transform">
            <Icons.Sparkles />
          </div>
          <div className="text-[10px] font-black text-[#FF7F50] uppercase tracking-[0.4em] mb-4">Твой секретный промокод</div>
          <div className="text-4xl font-black text-[#FF7F50] tracking-[0.2em]">{promoCode}</div>
        </div>

        <button 
          onClick={onBack}
          className="w-full coral-gradient text-white py-6 rounded-[32px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 active:scale-95 transition-all"
        >
          Вперед за новыми победами
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-20 relative">
      <div className="relative h-80">
        <SmartImage src={task.image} alt={task.title} containerClassName="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 bg-white/90 backdrop-blur p-4 rounded-3xl shadow-lg border border-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button 
          onClick={() => setShowReportModal(true)}
          className="absolute top-6 right-6 bg-white/90 backdrop-blur p-4 rounded-3xl shadow-lg border border-white text-gray-400 hover:text-red-500 transition-colors"
          title="Пожаловаться"
        >
          <Icons.Flag />
        </button>
      </div>

      <div className="px-6 -mt-12 bg-[#FDFCFB] rounded-t-[52px] relative pt-10 pb-12 space-y-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <span className="text-[#FF7F50] text-[10px] font-black uppercase tracking-[0.3em]">{task.category}</span>
             {task.challenge && (
               <span className="bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-100">
                 {task.challenge.label}
               </span>
             )}
             
             {/* Safe Escrow Badge */}
             <button 
                onClick={() => setShowEscrowInfo(true)}
                className="ml-auto bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1.5 active:scale-95 transition-transform"
             >
                <span className="animate-pulse"><Icons.Shield /></span>
                Сделка защищена
             </button>
          </div>
          <h1 className="text-3xl font-black leading-tight tracking-tight">{task.title}</h1>
        </div>

        <div className="flex items-center justify-between bg-white p-6 rounded-[36px] border border-gray-50 shadow-sm">
           <div className="flex items-center gap-4">
              <Avatar src={`https://i.pravatar.cc/100?u=${task.author}`} type={task.authorType} size="md" />
              <div>
                 <span className="text-sm font-black block">{task.author}</span>
                 <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Заказчик • {task.authorRating} ★</span>
              </div>
           </div>
           <div className="text-right">
              <span className="text-xl font-black text-[#FF7F50] block">{task.budget}</span>
              <span className="text-[9px] text-gray-300 font-black uppercase">Дедлайн: {task.deadline}</span>
           </div>
        </div>

        <div className="space-y-4">
           <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] ml-1">Детали задачи</h3>
           <p className="text-gray-500 text-sm leading-relaxed font-medium">
             {task.description}
           </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          {gameStatus === 'submitted' ? (
            <div className="space-y-4">
               <div className="w-full bg-emerald-50 text-emerald-600 py-6 rounded-[32px] text-center font-black uppercase tracking-widest text-[10px] border border-emerald-100 flex items-center justify-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  Заявка отправлена
               </div>
               {user.isPro && (
                 <button 
                  onClick={handleEditProposal}
                  className="w-full bg-white text-[#FF7F50] py-6 rounded-[32px] font-black uppercase tracking-widest text-[10px] border-2 border-[#FF7F50] active:scale-95 transition-all flex items-center justify-center gap-3"
                 >
                    <Icons.Edit />
                    Изменить отклик
                 </button>
               )}
            </div>
          ) : (
            <button 
              onClick={handleApply}
              className="w-full coral-gradient text-white py-6 rounded-[32px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 active:scale-95 transition-all"
            >
              {user.isPro ? 'Подать заявку (Priority)' : `Подать заявку (${user.proposalsLeft}/${user.maxProposals})`}
            </button>
          )}
          
          {!user.isPro && gameStatus !== 'submitted' && (
             <p className="text-[9px] text-center text-gray-400 font-black uppercase tracking-widest px-8">
               Редактирование и приоритет доступны в PRO версии
             </p>
          )}
        </div>
      </div>

      {/* Escrow Overlay */}
      {showEscrowInfo && (
         <div className="fixed inset-0 z-[100] flex items-end justify-center">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowEscrowInfo(false)}></div>
            <div className="relative w-full max-w-[428px] bg-white rounded-t-[48px] p-10 shadow-2xl animate-in slide-in-from-bottom duration-500">
               <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-10"></div>
               
               <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center shadow-inner">
                     <Icons.Shield />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight uppercase">Сделка без риска</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-medium">
                    Заказчик уже перевел бюджет на независимый счет AVYX. 
                    Деньги надежно заморожены и будут выплачены вам сразу после того, как работа будет принята. 
                    <br/><br/>
                    <span className="text-emerald-600 font-black">AVYX гарантирует 100% безопасность ваших выплат.</span>
                  </p>
               </div>

               <button 
                  onClick={() => setShowEscrowInfo(false)}
                  className="w-full mt-10 py-5 bg-gray-900 text-white rounded-3xl font-black uppercase text-[10px] tracking-widest"
               >
                  Понятно, спасибо ✨
               </button>
            </div>
         </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        contentType="task"
        contentId={task.id}
      />
    </div>
  );
};

export default TaskDetailScreen;
