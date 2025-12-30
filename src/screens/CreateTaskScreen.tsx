
import React, { useState } from 'react';
import { generateTaskDescription } from '../services/gemini';

interface CreateTaskScreenProps {
  onBack: () => void;
}

const CreateTaskScreen: React.FC<CreateTaskScreenProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'UI/UX',
    budget: '',
    deadline: '',
    description: '',
    difficulty: 3
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Заказ опубликован успешно!');
    onBack();
  };

  const handleAiHelp = async () => {
    if (!formData.title) return;
    setIsGenerating(true);
    const aiText = await generateTaskDescription(formData.title, formData.category);
    setFormData({ ...formData, description: aiText || '' });
    setIsGenerating(false);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2.5 bg-white rounded-2xl shadow-sm border border-gray-50">
           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-xl font-black uppercase tracking-tight">Создать заказ</h1>
        <div className="w-10"></div>
      </div>

      <div className="space-y-8 pt-4">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2">
           {[1, 2, 3].map(s => (
             <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-[#FF7F50]' : 'w-2 bg-gray-200'}`}></div>
           ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Что нужно сделать?</label>
               <input 
                 type="text" 
                 placeholder="Напр. Дизайн упаковки для чая"
                 className="w-full p-5 bg-white rounded-3xl shadow-sm border-none focus:ring-2 focus:ring-[#FF7F50] outline-none transition-all font-bold"
                 value={formData.title}
                 onChange={e => setFormData({...formData, title: e.target.value})}
               />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Категория</label>
               <div className="grid grid-cols-2 gap-2">
                 {['UI/UX', 'Графика', 'Логотипы', 'Иллюстрация'].map(cat => (
                   <button 
                     key={cat}
                     type="button"
                     onClick={() => setFormData({...formData, category: cat as any})}
                     className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${formData.category === cat ? 'bg-[#FF7F50]/10 border-[#FF7F50] text-[#FF7F50]' : 'bg-white border-gray-100 text-gray-400'}`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>
             </div>
             <button 
               onClick={() => setStep(2)}
               disabled={!formData.title}
               className="w-full coral-gradient text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-lg shadow-orange-100 active:scale-95 transition-all disabled:opacity-50"
             >
               Далее
             </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
             <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Бюджет</label>
               <input 
                 type="text" 
                 placeholder="Напр. 10 000 ₽"
                 className="w-full p-5 bg-white rounded-3xl shadow-sm border-none focus:ring-2 focus:ring-[#FF7F50] outline-none font-bold"
                 value={formData.budget}
                 onChange={e => setFormData({...formData, budget: e.target.value})}
               />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Срок</label>
               <input 
                 type="text" 
                 placeholder="Напр. 5 дней"
                 className="w-full p-5 bg-white rounded-3xl shadow-sm border-none focus:ring-2 focus:ring-[#FF7F50] outline-none font-bold"
                 value={formData.deadline}
                 onChange={e => setFormData({...formData, deadline: e.target.value})}
               />
             </div>
             <div className="flex justify-between gap-4">
               <button 
                 onClick={() => setStep(1)}
                 className="flex-1 bg-gray-50 text-gray-400 py-5 rounded-3xl font-black uppercase tracking-widest text-[10px]"
               >
                 Назад
               </button>
               <button 
                 onClick={() => setStep(3)}
                 className="flex-[2] coral-gradient text-white py-5 rounded-3xl font-black uppercase tracking-widest text-[10px]"
               >
                 К деталям
               </button>
             </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right duration-300">
             <div className="space-y-2">
               <div className="flex justify-between items-center mb-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Описание задачи</label>
                 <button 
                   type="button"
                   disabled={isGenerating || !formData.title}
                   onClick={handleAiHelp}
                   className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${isGenerating ? 'bg-orange-50 text-[#FF7F50] animate-pulse' : 'bg-teal-50 text-teal-600 border border-teal-100 hover:bg-teal-100'}`}
                 >
                   {isGenerating ? '✨ Пишу ТЗ...' : '✨ Магия AI'}
                 </button>
               </div>
               <textarea 
                 rows={8}
                 placeholder="Подробно опишите, что нужно сделать..."
                 className="w-full p-5 bg-white rounded-[32px] shadow-sm border-none focus:ring-2 focus:ring-[#FF7F50] outline-none resize-none font-medium text-sm leading-relaxed"
                 value={formData.description}
                 onChange={e => setFormData({...formData, description: e.target.value})}
               />
             </div>
             <button type="submit" className="w-full coral-gradient text-white py-5 rounded-[28px] font-black uppercase tracking-widest shadow-lg shadow-orange-100 active:scale-95 transition-all">
               Опубликовать заказ
             </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateTaskScreen;
