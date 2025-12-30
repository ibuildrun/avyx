
import React, { useState, useRef } from 'react';
import { User } from '../types';

interface EditProfileScreenProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onBack: () => void;
}

const BANNER_PRESETS = [
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=800',
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'
];

const BORDER_COLORS = [
  '#FFFFFF', // White
  '#FF7F50', // Coral
  '#A7FFEB', // Mint
  '#E6E6FA', // Lavender
  '#FFD700', // Gold
  '#FFC0CB', // Pink
  '#2D3436', // Dark
];

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ user, onSave, onBack }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    nickname: user.nickname,
    specialty: user.specialty,
    about: user.about || '',
    bannerImage: user.bannerImage || '',
    avatarBorderColor: user.avatarBorderColor || '#FFFFFF'
  });

  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!formData.name || !formData.nickname) return;
    onSave({
      ...user,
      ...formData
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, bannerImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 space-y-8 bg-[#FDFCFB] min-h-screen animate-in slide-in-from-right duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-3 bg-white rounded-2xl shadow-sm border border-gray-50 active:scale-90 transition-transform"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-xl font-black uppercase tracking-tight">Настройки</h1>
        <div className="w-10"></div>
      </div>

      <div className="space-y-8">
        {/* Banner Selection & Upload */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Фон профиля</label>
            <button 
              onClick={() => bannerInputRef.current?.click()}
              className="text-[10px] font-black text-[#FF7F50] uppercase tracking-widest flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              Загрузить свое
            </button>
            <input type="file" ref={bannerInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setFormData({...formData, bannerImage: ''})}
              className={`h-24 rounded-2xl border-2 transition-all flex items-center justify-center text-[10px] font-black uppercase ${!formData.bannerImage ? 'border-[#FF7F50] coral-gradient text-white' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
            >
              Стандарт
            </button>
            {BANNER_PRESETS.map((url, idx) => (
              <button 
                key={idx}
                onClick={() => setFormData({...formData, bannerImage: url})}
                className={`h-24 rounded-2xl border-2 overflow-hidden transition-all ${formData.bannerImage === url ? 'border-[#FF7F50] ring-4 ring-orange-50 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={url} className="w-full h-full object-cover" alt="preset" />
              </button>
            ))}
            {formData.bannerImage && !BANNER_PRESETS.includes(formData.bannerImage) && (
              <button className="h-24 rounded-2xl border-2 border-[#FF7F50] overflow-hidden ring-4 ring-orange-50 relative">
                 <img src={formData.bannerImage} className="w-full h-full object-cover" alt="user upload" />
                 <div className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm">
                   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FF7F50" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                 </div>
              </button>
            )}
          </div>
        </div>

        {/* Avatar & Border Color Section */}
        <div className="flex flex-col items-center gap-6">
           <div className="relative group">
              <div 
                className="absolute inset-0 avatar-diamond scale-[1.25] shadow-xl transition-colors duration-300"
                style={{ backgroundColor: formData.avatarBorderColor }}
              ></div>
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400" 
                className="w-24 h-24 avatar-diamond relative z-10 scale-110 object-cover" 
                alt="Avatar Preview" 
              />
           </div>
           
           <div className="space-y-3 w-full text-center">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Цвет рамки алмаза</label>
             <div className="flex justify-center flex-wrap gap-3">
               {BORDER_COLORS.map(color => (
                 <button
                   key={color}
                   onClick={() => setFormData({...formData, avatarBorderColor: color})}
                   className={`w-8 h-8 rounded-full border-2 transition-all ${formData.avatarBorderColor === color ? 'border-[#FF7F50] scale-125 shadow-md' : 'border-transparent hover:scale-110'}`}
                   style={{ backgroundColor: color }}
                 />
               ))}
               <div className="relative w-8 h-8">
                 <input 
                   type="color" 
                   value={formData.avatarBorderColor} 
                   onChange={(e) => setFormData({...formData, avatarBorderColor: e.target.value})}
                   className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                 />
                 <div className="w-8 h-8 rounded-full border-2 border-gray-100 flex items-center justify-center bg-white shadow-sm overflow-hidden pointer-events-none">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m19 21-7-7"/><circle cx="12" cy="7" r="5"/><path d="m19 14-7 7"/></svg>
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
           <div className="space-y-2">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Имя</label>
             <input 
               type="text" 
               className="w-full p-5 bg-white rounded-[32px] shadow-sm border-none focus:ring-2 focus:ring-[#FF7F50]/20 outline-none font-bold transition-all"
               value={formData.name}
               onChange={(e) => setFormData({...formData, name: e.target.value})}
             />
           </div>

           <div className="space-y-2">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Никнейм</label>
             <input 
               type="text" 
               className="w-full p-5 bg-white rounded-[32px] shadow-sm border-none focus:ring-2 focus:ring-[#FF7F50]/20 outline-none font-bold transition-all"
               value={formData.nickname}
               onChange={(e) => setFormData({...formData, nickname: e.target.value})}
             />
           </div>

           <div className="space-y-2">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">О себе</label>
             <textarea 
               rows={4}
               className="w-full p-5 bg-white rounded-[32px] shadow-sm border-none focus:ring-2 focus:ring-[#FF7F50]/20 outline-none font-bold transition-all resize-none"
               value={formData.about}
               onChange={(e) => setFormData({...formData, about: e.target.value})}
             />
           </div>
        </div>
      </div>

      <button 
        onClick={handleSave}
        className="w-full coral-gradient text-white py-5 rounded-[28px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 active:scale-95 transition-all mt-4"
      >
        Сохранить настройки
      </button>
    </div>
  );
};

export default EditProfileScreen;
