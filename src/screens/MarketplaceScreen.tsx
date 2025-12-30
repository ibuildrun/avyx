
import React, { useState } from 'react';
import { User } from '../types';

interface MarketplaceScreenProps {
  user: User;
  onBack: () => void;
  onPurchase: (updatedUser: User) => void;
}

const Icons = {
  Diamond: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 12L2 9Z"/><path d="M11 3 8 9l4 12 4-12-3-6"/><path d="M2 9h20"/></svg>
  ),
  Rocket: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
  ),
  Radar: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 12 7.5 7.5"/><path d="m19 12-2.5-2.5"/><path d="M12 19v-2.5"/></svg>
  ),
  Star: ({ size = 18, className = "" }: { size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
  ),
  Info: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
  )
};

const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ user, onBack, onPurchase }) => {
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const offers = [
    {
      id: 'pro',
      title: 'AVYX PRO Status',
      stars: 250,
      description: 'БЕЗЛИМИТНЫЕ ОТКЛИКИ, приоритет в очереди и доступ к VIP заказам.',
      icon: <Icons.Diamond />,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      actionLabel: user.isPro ? 'Уже активно' : 'Активировать PRO'
    },
    {
      id: 'radar',
      title: 'Радар Талантов',
      stars: 450,
      description: 'Видьте лучшие предложения раньше всех. Только для уровней 10+ или PRO.',
      icon: <Icons.Radar />,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      actionLabel: 'Разблокировать'
    },
    {
      id: 'featured_task',
      title: 'Boost Задания',
      stars: 100,
      description: 'Ваш заказ будет выделен в ленте и поднят в самый верх на 24 часа.',
      icon: <Icons.Rocket />,
      color: 'bg-orange-50 text-[#FF7F50] border-orange-100',
      actionLabel: 'Ускорить заказ'
    }
  ];

  const handlePurchase = (offerId: string, cost: number) => {
    if (user.stars < cost) {
      alert('Недостаточно Stars. Пополните баланс в настройках Telegram.');
      return;
    }

    if (offerId === 'pro' && !user.isPro) {
      setPurchasing('pro');
      setTimeout(() => {
        onPurchase({ ...user, isPro: true, stars: user.stars - cost, maxProposals: 999, proposalsLeft: 999 });
        setPurchasing(null);
        alert('Поздравляем! Теперь вы PRO пользователь AVYX. Лимиты на отклики сняты.');
      }, 1500);
    } else {
      alert('Транзакция через Telegram Stars инициирована...');
    }
  };

  return (
    <div className="p-6 space-y-8 bg-[#FDFCFB] min-h-screen animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-50 active:scale-90 transition-transform">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-xl font-black uppercase tracking-tight">AVYX Store</h1>
        <div className="w-10"></div>
      </div>

      {/* Wallet with Stars focus */}
      <div className="bg-white p-6 rounded-[40px] shadow-sm border border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-yellow-100">
            <Icons.Star size={24} />
          </div>
          <div className="space-y-0.5">
             <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Баланс Stars</span>
             <div className="text-2xl font-black flex items-center gap-1.5">
               {user.stars}
               <Icons.Star size={20} className="text-yellow-400" />
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-1">Премиум возможности</h3>
        
        <div className="space-y-5">
           {offers.map((offer) => (
             <div key={offer.id} className={`p-6 rounded-[32px] border bg-white shadow-sm space-y-4 transition-all ${offer.id === 'pro' && user.isPro ? 'opacity-60 grayscale' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center border ${offer.color}`}>
                    {offer.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-gray-900 flex items-center justify-end gap-1">
                      {offer.stars}
                      <Icons.Star size={16} className="text-yellow-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                   <h4 className="text-lg font-black leading-tight tracking-tight">{offer.title}</h4>
                   <p className="text-xs text-gray-500 font-medium leading-relaxed">{offer.description}</p>
                </div>

                <button 
                  onClick={() => handlePurchase(offer.id, offer.stars)}
                  disabled={purchasing === offer.id || (offer.id === 'pro' && user.isPro)}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 flex items-center justify-center gap-2 ${offer.id === 'pro' && !user.isPro ? 'coral-gradient text-white shadow-lg shadow-orange-100' : 'bg-gray-900 text-white'}`}
                >
                  {purchasing === offer.id ? 'Обработка...' : offer.actionLabel}
                </button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceScreen;
