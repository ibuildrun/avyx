import React, { useState } from 'react';
import { api } from '../api';
import type { CreateReportDto } from '../api/types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: 'task' | 'comment' | 'user' | 'work';
  contentId: string;
}

const REPORT_REASONS = [
  { value: 'spam', label: 'Спам', icon: '📧' },
  { value: 'inappropriate', label: 'Неприемлемый контент', icon: '🚫' },
  { value: 'fraud', label: 'Мошенничество', icon: '⚠️' },
  { value: 'other', label: 'Другое', icon: '📝' },
] as const;

const ReportModal: React.FC<ReportModalProps> = ({ 
  isOpen, 
  onClose, 
  contentType, 
  contentId 
}) => {
  const [selectedReason, setSelectedReason] = useState<CreateReportDto['reason'] | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);
    setError(null);

    const result = await api.reports.create({
      content_type: contentType,
      content_id: contentId,
      reason: selectedReason,
      description: description.trim() || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
        // Reset state after close
        setSelectedReason(null);
        setDescription('');
        setSuccess(false);
      }, 1500);
    } else {
      setError(result.error || 'Не удалось отправить жалобу');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className="relative w-full max-w-[428px] bg-white rounded-t-[48px] shadow-2xl animate-in slide-in-from-bottom duration-500 max-h-[85vh] flex flex-col">
        <div className="p-8 pb-0 flex-shrink-0">
          <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8" />
        </div>
        <div className="overflow-y-auto flex-1 px-8 pb-8">
        
        {success ? (
          <div className="flex flex-col items-center text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-black">Жалоба отправлена</h3>
            <p className="text-gray-400 text-sm mt-2">
              Спасибо! Мы рассмотрим вашу жалобу в ближайшее время.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                  <line x1="4" x2="4" y1="22" y2="15"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black">Пожаловаться</h3>
                <p className="text-gray-400 text-xs">Выберите причину жалобы</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason.value}
                  onClick={() => setSelectedReason(reason.value)}
                  className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-3 transition-all ${
                    selectedReason === reason.value
                      ? 'border-[#FF7F50] bg-orange-50'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <span className="text-xl">{reason.icon}</span>
                  <span className="font-bold text-sm">{reason.label}</span>
                  {selectedReason === reason.value && (
                    <svg className="ml-auto text-[#FF7F50]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                Дополнительно (необязательно)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Опишите проблему подробнее..."
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-100 outline-none text-sm font-medium resize-none"
                rows={3}
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase text-[10px] tracking-widest"
              >
                Отмена
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedReason || isSubmitting}
                className="flex-1 py-4 coral-gradient text-white rounded-2xl font-black uppercase text-[10px] tracking-widest disabled:opacity-50 disabled:grayscale"
              >
                {isSubmitting ? 'Отправка...' : 'Отправить'}
              </button>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
