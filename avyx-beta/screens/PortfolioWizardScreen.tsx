
import React, { useState, useRef } from 'react';
import { PortfolioItem } from '../types';
import SmartImage from '../components/SmartImage';

interface PortfolioWizardScreenProps {
  onSave: (item: PortfolioItem) => void;
  onBack: () => void;
}

const PortfolioWizardScreen: React.FC<PortfolioWizardScreenProps> = ({ onSave, onBack }) => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!title || !image) return;
    
    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      title,
      image,
      likes: 0,
      views: 0
    };
    
    onSave(newItem);
  };

  return (
    <div className="p-6 space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-3 bg-white rounded-2xl shadow-sm border border-gray-50 active:scale-90 transition-transform">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-xl font-black uppercase tracking-tight">Новая работа</h1>
        <div className="w-10"></div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Превью работы</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-[4/3] w-full rounded-[40px] border-2 border-dashed border-gray-100 bg-white overflow-hidden flex flex-col items-center justify-center cursor-pointer group transition-all hover:border-[#FF7F50]/30"
          >
            {image ? (
              <SmartImage src={image} containerClassName="w-full h-full" />
            ) : (
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-orange-50 rounded-3xl flex items-center justify-center text-[#FF7F50] mx-auto group-hover:scale-110 transition-transform">
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" x2="22" y1="5" y2="5"/><line x1="19" x2="19" y1="2" y2="8"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                </div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Нажми, чтобы загрузить</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Название проекта</label>
          <input 
            type="text" 
            placeholder="Напр. Redesign of Coffee App"
            className="w-full p-5 bg-white rounded-3xl shadow-sm border-none focus:ring-2 focus:ring-[#FF7F50]/20 outline-none font-bold transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={!title || !image}
        className="w-full coral-gradient text-white py-6 rounded-[32px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
      >
        Сохранить в портфолио
      </button>
    </div>
  );
};

export default PortfolioWizardScreen;
