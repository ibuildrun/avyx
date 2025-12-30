import React, { useState } from 'react';

interface SmartImageProps {
  src?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
}

const SmartImage: React.FC<SmartImageProps> = ({ src, alt = "", className = "", containerClassName = "" }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(src ? 'loading' : 'error');

  const handleLoad = () => setStatus('loaded');
  const handleError = () => setStatus('error');

  return (
    <div className={`relative overflow-hidden bg-gray-50 ${containerClassName}`}>
      {status === 'loading' && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-orange-50/30 to-gray-100 bg-[length:200%_100%] animate-shimmer"></div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F5F5F5] text-gray-300">
          <div className="relative">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="2"/>
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
            </svg>
            <div className="absolute -top-1 -right-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF7F50" strokeWidth="3">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
              </svg>
            </div>
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] mt-3 opacity-30">AVYX Design Ref</span>
        </div>
      )}

      {src && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`${className} w-full h-full object-cover transition-opacity duration-500 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
};

export default SmartImage;
