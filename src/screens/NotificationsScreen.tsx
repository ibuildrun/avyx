
import React from 'react';
import { NotificationType } from '../types';
import { MOCK_NOTIFICATIONS } from '../constants';

interface NotificationsScreenProps {
  onBack: () => void;
}

const NotificationIcons = {
  response: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  update: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  ),
  deadline: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  achievement: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
  ),
  system: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
  )
};

const getBgColor = (type: NotificationType) => {
  switch (type) {
    case 'achievement': return 'bg-yellow-50 text-yellow-600';
    case 'deadline': return 'bg-red-50 text-red-500';
    case 'update': return 'bg-emerald-50 text-emerald-600';
    case 'response': return 'bg-orange-50 text-[#FF7F50]';
    default: return 'bg-gray-50 text-gray-500';
  }
};

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBack }) => {
  return (
    <div className="p-4 space-y-6 bg-[#FDFCFB] min-h-screen pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-3 bg-white rounded-2xl shadow-sm border border-gray-50 active:scale-90 transition-transform"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-xl font-black uppercase tracking-tight">Уведомления</h1>
        <button className="text-[10px] font-black text-[#FF7F50] uppercase underline decoration-2 underline-offset-4">
          Прочитать все
        </button>
      </div>

      {/* List */}
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {MOCK_NOTIFICATIONS.length > 0 ? MOCK_NOTIFICATIONS.map(notification => (
          <div 
            key={notification.id}
            className={`p-5 rounded-[32px] border bg-white transition-all shadow-sm ${!notification.isRead ? 'border-[#FF7F50]/20' : 'border-gray-50 opacity-70'}`}
          >
            <div className="flex gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${getBgColor(notification.type)}`}>
                {NotificationIcons[notification.type]()}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-black leading-tight pr-2">{notification.title}</h4>
                  <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter whitespace-nowrap">
                    {notification.date}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  {notification.message}
                </p>
                {!notification.isRead && (
                  <div className="pt-2">
                    <div className="w-1.5 h-1.5 bg-[#FF7F50] rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-20 opacity-30">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-[10px] font-black uppercase tracking-widest">Тишина и спокойствие</p>
          </div>
        )}
      </div>

      {/* Settings Helper */}
      <div className="p-6 bg-orange-50 rounded-[32px] border border-orange-100 mt-8">
        <div className="flex items-center gap-3 mb-2">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF7F50" strokeWidth="2.5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
           <h5 className="text-[10px] font-black text-[#FF7F50] uppercase tracking-widest">Настройка уведомлений</h5>
        </div>
        <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
          Вы можете настроить типы получаемых событий в настройках Telegram бота. Мы присылаем только самое важное.
        </p>
      </div>
    </div>
  );
};

export default NotificationsScreen;
