
import React from 'react';
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
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-32 h-32',
  };

  const getShape = () => {
    if (isDiamond || type === 'company') return 'avatar-diamond scale-110';
    switch (type) {
      case 'designer': return 'rounded-full';
      case 'entrepreneur': return 'rounded-2xl';
      default: return 'rounded-full';
    }
  };

  return (
    <div className={`relative ${hasGlow ? 'avatar-glow' : ''}`}>
      <div className={`${sizeMap[size]} ${getShape()} overflow-hidden bg-gray-100 flex-shrink-0 ${className} shadow-sm transition-transform duration-300`}>
        <img src={src} alt="avatar" className="w-full h-full object-cover" />
      </div>
      {hasGlow && (
        <div className="absolute inset-0 avatar-diamond bg-orange-400/20 blur-xl -z-10 scale-125"></div>
      )}
    </div>
  );
};

export default Avatar;
