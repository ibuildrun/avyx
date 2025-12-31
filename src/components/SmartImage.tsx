import React, { useState } from 'react';

interface SmartImageProps {
  src?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
}

const SmartImage: React.FC<SmartImageProps> = ({ src, alt = "", className = "", containerClassName = "" }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(!src ? 'error' : 'loading');

  const handleLoad = () => setStatus('loaded');
  const handleError = () => setStatus('error');

  // Reset status when src changes
  React.useEffect(() => {
    setStatus(!src ? 'error' : 'loading');
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-gray-50 ${containerClassName}`}>
      {status === 'loading' && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-orange-50/30 to-gray-100 bg-[length:200%_100%] animate-shimmer"></div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 text-[#FF7F50]">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
            <circle cx="9" cy="9" r="2"/>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
          </svg>
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
