import React, { useState } from 'react';
import { UserType } from '../types';

interface AvatarProps {
  src: string;
  type: UserType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isDiamond?: boolean;
  hasGlow?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ src, type, size = 'md', className = '', isDiamond = false, hasGlow = false }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(src ? 'loading' : 'error');

  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-32 h-32',
  };

  const iconSizeMap = {
    sm: 14,
    md: 20,
    lg: 28,
    xl: 48,
  };

  const getShape = () => {
    if (isDiamond || type === 'company') return 'avatar-diamond scale-110';
    switch (type) {
      case 'designer': return 'rounded-full';
      case 'entrepreneur': return 'rounded-2xl';
      default: return 'rounded-full';
    }
  };

  const handleLoad = () => setStatus('loaded');
  const handleError = () => setStatus('error');

  const iconSize = iconSizeMap[size];

  return (
    <div className={`relative ${hasGlow ? 'avatar-glow' : ''}`}>
      <div className={`${sizeMap[size]} ${getShape()} overflow-hidden bg-gray-100 flex-shrink-0 ${className} shadow-sm transition-transform duration-300 relative`}>
        {/* Loading shimmer */}
        {status === 'loading' && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-orange-50/30 to-gray-100 bg-[length:200%_100%] animate-shimmer"></div>
        )}

        {/* Error fallback */}
        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 text-[#FF7F50]">
            <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        )}

        {/* Image */}
        {src && (
          <img 
            src={src} 
            alt="avatar" 
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </div>
      {hasGlow && (
        <div className="absolute inset-0 avatar-diamond bg-orange-400/20 blur-xl -z-10 scale-125"></div>
      )}
    </div>
  );
};

export default Avatar;
