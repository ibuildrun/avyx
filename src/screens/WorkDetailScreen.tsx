
import React, { useState } from 'react';
import { CompletedWork } from '../types';
import SmartImage from '../components/SmartImage';
import ReportModal from '../components/ReportModal';

interface WorkDetailScreenProps {
  work: CompletedWork;
  onBack: () => void;
}

const WorkDetailScreen: React.FC<WorkDetailScreenProps> = ({ work, onBack }) => {
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: 'work' | 'comment'; id: string } | null>(null);

  const handleReportWork = () => {
    setReportTarget({ type: 'work', id: work.id });
    setShowReportModal(true);
  };

  const handleReportComment = (commentId: string) => {
    setReportTarget({ type: 'comment', id: commentId });
    setShowReportModal(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-24 animate-in slide-in-from-bottom duration-500">
      {/* Top Media */}
      <div className="relative w-full aspect-square">
        <SmartImage src={work.image} alt={work.title} containerClassName="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur p-3 rounded-2xl shadow-sm"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button 
          onClick={handleReportWork}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-2xl shadow-sm text-gray-400 hover:text-red-500 transition-colors"
          title="Пожаловаться"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
        </button>
      </div>

      <div className="px-6 -mt-10 bg-[#FDFCFB] rounded-t-[40px] relative pt-8 space-y-8">
        {/* Header Interaction */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
             <img src={work.authorAvatar} className="w-12 h-12 rounded-full border-2 border-white shadow-md" alt="" />
             <div>
                <span className="text-sm font-black block">@{work.author}</span>
                <span className="text-[10px] text-[#FF7F50] font-black uppercase tracking-widest">{work.category}</span>
             </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`p-4 rounded-3xl transition-all shadow-sm active:scale-90 ${isLiked ? 'bg-red-50 text-red-500' : 'bg-white text-gray-300'}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
           <h1 className="text-3xl font-black tracking-tight leading-tight">{work.title}</h1>
           <p className="text-gray-500 text-sm leading-relaxed font-medium">
             {work.description}
           </p>
           
           <div className="flex gap-6 py-4 border-y border-gray-50">
              <div className="text-center">
                 <div className="font-black text-lg">{work.likes + (isLiked ? 1 : 0)}</div>
                 <div className="text-[9px] text-gray-300 font-black uppercase tracking-widest">Лайков</div>
              </div>
              <div className="text-center">
                 <div className="font-black text-lg">{work.views}</div>
                 <div className="text-[9px] text-gray-300 font-black uppercase tracking-widest">Просмотров</div>
              </div>
              <div className="text-center">
                 <div className="font-black text-lg">{work.comments.length}</div>
                 <div className="text-[9px] text-gray-300 font-black uppercase tracking-widest">Откликов</div>
              </div>
           </div>
        </div>

        {/* Comments Section */}
        <section className="space-y-6">
           <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Комментарии</h3>
           
           <div className="space-y-4">
              {work.comments.length > 0 ? work.comments.map(comment => (
                <div key={comment.id} className="flex gap-4 group">
                   <img src={comment.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm flex-shrink-0" alt="" />
                   <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm border border-gray-50 flex-1 relative">
                      <div className="flex justify-between items-center mb-1">
                         <span className="text-[11px] font-black">@{comment.user}</span>
                         <div className="flex items-center gap-2">
                           <span className="text-[8px] text-gray-300 font-bold">{comment.date}</span>
                           <button 
                             onClick={() => handleReportComment(comment.id)}
                             className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all p-1"
                             title="Пожаловаться на комментарий"
                           >
                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
                           </button>
                         </div>
                      </div>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed">{comment.text}</p>
                   </div>
                </div>
              )) : (
                <div className="text-center py-10 opacity-30">
                   <div className="text-4xl mb-2">💬</div>
                   <p className="text-[10px] font-black uppercase tracking-widest">Будь первым, кто оставит отзыв</p>
                </div>
              )}
           </div>
        </section>

        {/* Sticky Comment Input */}
        <div className="fixed bottom-0 left-0 right-0 max-w-[428px] mx-auto p-4 bg-white/90 backdrop-blur-xl border-t border-gray-50 flex gap-3 items-center z-[60]">
           <input 
             type="text" 
             placeholder="Напиши что-нибудь вдохновляющее..."
             className="flex-1 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-100 outline-none text-xs font-bold"
             value={commentText}
             onChange={(e) => setCommentText(e.target.value)}
           />
           <button 
             disabled={!commentText.trim()}
             className={`p-4 rounded-2xl coral-gradient text-white shadow-lg transition-all active:scale-90 disabled:opacity-30 disabled:grayscale`}
           >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
           </button>
        </div>
      </div>

      {/* Report Modal */}
      {reportTarget && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => {
            setShowReportModal(false);
            setReportTarget(null);
          }}
          contentType={reportTarget.type}
          contentId={reportTarget.id}
        />
      )}
    </div>
  );
};

export default WorkDetailScreen;
