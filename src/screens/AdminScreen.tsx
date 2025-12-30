import React, { useState, useEffect } from 'react';
import { api } from '../api';

interface Report {
  id: string;
  content_type: string;
  content_id: string;
  reason: string;
  description: string | null;
  status: string;
  created_at: string;
}

interface AdminUser {
  id: number;
  username: string | null;
  first_name: string;
  last_name: string | null;
  status: string;
  level: number;
  created_at: string;
}

interface Stats {
  users: number;
  tasks: number;
  reports: number;
  payments: number;
}

interface AdminScreenProps {
  onBack: () => void;
}

type Tab = 'reports' | 'users' | 'logs';

const AdminScreen: React.FC<AdminScreenProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<Tab>('reports');
  const [stats, setStats] = useState<Stats | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
    loadReports();
  }, []);

  const loadStats = async () => {
    const result = await api.admin.getStats();
    if (result.success && result.data) {
      setStats(result.data);
    }
  };

  const loadReports = async () => {
    setLoading(true);
    const result = await api.admin.getReports();
    if (result.success && result.data) {
      setReports(result.data.reports);
    } else {
      setError(result.error || 'Ошибка загрузки');
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    const result = await api.admin.getUsers();
    if (result.success && result.data) {
      setUsers(result.data.users);
    }
    setLoading(false);
  };

  const handleProcessReport = async (reportId: string, action: string) => {
    const reason = action !== 'dismiss' ? prompt('Причина (опционально):') : undefined;
    setProcessingId(reportId);
    
    const result = await api.admin.processReport(reportId, action, reason || undefined);
    
    if (result.success) {
      loadReports();
      loadStats();
    } else {
      alert(result.error || 'Ошибка');
    }
    setProcessingId(null);
  };

  const handleUpdateUser = async (userId: number, status: string) => {
    const reason = status !== 'active' ? prompt('Причина:') : undefined;
    
    const result = await api.admin.updateUser(userId, status, reason || undefined);
    
    if (result.success) {
      loadUsers();
    } else {
      alert(result.error || 'Ошибка');
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'users' && users.length === 0) {
      loadUsers();
    }
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      spam: 'Спам',
      inappropriate: 'Неприемлемый контент',
      fraud: 'Мошенничество',
      other: 'Другое'
    };
    return labels[reason] || reason;
  };

  const getContentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      task: 'Заказ',
      comment: 'Комментарий',
      user: 'Пользователь',
      work: 'Работа'
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-black">Админ-панель</h1>
            <p className="text-xs text-gray-400">Модерация контента</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-2 p-4">
          <div className="bg-white rounded-2xl p-3 text-center border border-gray-50">
            <div className="text-lg font-black text-blue-500">{stats.users}</div>
            <div className="text-[8px] text-gray-400 font-bold uppercase">Юзеры</div>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center border border-gray-50">
            <div className="text-lg font-black text-green-500">{stats.tasks}</div>
            <div className="text-[8px] text-gray-400 font-bold uppercase">Заказы</div>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center border border-gray-50">
            <div className="text-lg font-black text-red-500">{stats.reports}</div>
            <div className="text-[8px] text-gray-400 font-bold uppercase">Жалобы</div>
          </div>
          <div className="bg-white rounded-2xl p-3 text-center border border-gray-50">
            <div className="text-lg font-black text-purple-500">{stats.payments}</div>
            <div className="text-[8px] text-gray-400 font-bold uppercase">Платежи</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="px-4 flex gap-2 mb-4">
        <button
          onClick={() => handleTabChange('reports')}
          className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-wide transition-all ${
            activeTab === 'reports' 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-500 border border-gray-100'
          }`}
        >
          Жалобы
        </button>
        <button
          onClick={() => handleTabChange('users')}
          className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-wide transition-all ${
            activeTab === 'users' 
              ? 'bg-blue-500 text-white' 
              : 'bg-white text-gray-500 border border-gray-100'
          }`}
        >
          Юзеры
        </button>
      </div>

      {/* Content */}
      <div className="px-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-[#FF7F50] rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 text-sm mt-4">Загрузка...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        ) : activeTab === 'reports' ? (
          <div className="space-y-3">
            {reports.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-gray-50">
                <div className="text-4xl mb-3">✅</div>
                <p className="text-gray-500 text-sm font-medium">Нет активных жалоб</p>
              </div>
            ) : (
              reports.map(report => (
                <div key={report.id} className="bg-white rounded-3xl p-4 border border-gray-50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-black uppercase text-gray-400">
                        {getContentTypeLabel(report.content_type)}
                      </span>
                      <span className="text-xs text-gray-300 ml-2">#{report.content_id.slice(0, 8)}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {new Date(report.created_at).toLocaleDateString('ru')}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold">
                      {getReasonLabel(report.reason)}
                    </span>
                  </div>
                  
                  {report.description && (
                    <p className="text-sm text-gray-600">{report.description}</p>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleProcessReport(report.id, 'dismiss')}
                      disabled={processingId === report.id}
                      className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold disabled:opacity-50"
                    >
                      Отклонить
                    </button>
                    <button
                      onClick={() => handleProcessReport(report.id, 'warn_user')}
                      disabled={processingId === report.id}
                      className="flex-1 py-2 bg-yellow-100 text-yellow-700 rounded-xl text-xs font-bold disabled:opacity-50"
                    >
                      Предупредить
                    </button>
                    <button
                      onClick={() => handleProcessReport(report.id, 'hide_content')}
                      disabled={processingId === report.id}
                      className="flex-1 py-2 bg-orange-100 text-orange-700 rounded-xl text-xs font-bold disabled:opacity-50"
                    >
                      Скрыть
                    </button>
                    <button
                      onClick={() => handleProcessReport(report.id, 'ban_user')}
                      disabled={processingId === report.id}
                      className="flex-1 py-2 bg-red-100 text-red-700 rounded-xl text-xs font-bold disabled:opacity-50"
                    >
                      Бан
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="bg-white rounded-3xl p-4 border border-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-sm">
                      {user.first_name} {user.last_name || ''}
                    </div>
                    <div className="text-xs text-gray-400">
                      @{user.username || 'unknown'} · Lvl {user.level}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    user.status === 'banned' ? 'bg-red-100 text-red-600' :
                    user.status === 'warned' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {user.status === 'banned' ? 'Забанен' : 
                     user.status === 'warned' ? 'Предупрежден' : 'Активен'}
                  </span>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleUpdateUser(user.id, 'active')}
                    className="flex-1 py-2 bg-green-100 text-green-700 rounded-xl text-xs font-bold"
                  >
                    Активен
                  </button>
                  <button
                    onClick={() => handleUpdateUser(user.id, 'warned')}
                    className="flex-1 py-2 bg-yellow-100 text-yellow-700 rounded-xl text-xs font-bold"
                  >
                    Предупредить
                  </button>
                  <button
                    onClick={() => handleUpdateUser(user.id, 'banned')}
                    className="flex-1 py-2 bg-red-100 text-red-700 rounded-xl text-xs font-bold"
                  >
                    Забанить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminScreen;
