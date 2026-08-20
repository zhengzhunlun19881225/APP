import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';

interface AvatarProps {
  src?: string;
  name: string;
  avatarType?: 'image' | 'custom' | 'grid';
  gridAvatars?: string[];
  unreadCount?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Extract surname or uppercase initial letter
export const getAvatarChar = (name: string): string => {
  if (!name || !name.trim()) return '';
  const trimmed = name.trim();
  const firstChar = trimmed.charAt(0);
  if (/[a-zA-Z]/.test(firstChar)) {
    return firstChar.toUpperCase();
  }
  return firstChar;
};

// Deterministic palette background classes based on existing system colors
export const getAvatarBgClass = (name: string): string => {
  const bgClasses = [
    'bg-[#3b82f6]', // Blue (Primary)
    'bg-[#10b981]', // Emerald (Green)
    'bg-[#f97316]', // Orange
    'bg-[#8b5cf6]', // Purple
    'bg-[#f59e0b]', // Amber
    'bg-[#06b6d4]', // Cyan
    'bg-[#ec4899]', // Pink
    'bg-[#6366f1]', // Indigo
    'bg-[#14b8a6]', // Teal
    'bg-[#ef4444]', // Rose Red
  ];
  if (!name) return bgClasses[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % bgClasses.length;
  return bgClasses[index];
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  avatarType,
  gridAvatars,
  unreadCount,
  size = 'md',
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  }[size];

  const fontSizeClasses = {
    sm: 'text-[15px]',
    md: 'text-[17px]',
    lg: 'text-[22px]'
  }[size];

  // Render group 2x2 grid avatar inside a circle
  if (avatarType === 'grid' && gridAvatars && gridAvatars.length >= 4) {
    return (
      <div className="relative inline-block flex-shrink-0">
        <div className={`${sizeClasses} rounded-full overflow-hidden bg-slate-100 p-0.5 grid grid-cols-2 gap-0.5 ring-1 ring-black/5 shadow-xs ${className}`}>
          {gridAvatars.slice(0, 4).map((gSrc, idx) => (
            <div key={idx} className="overflow-hidden bg-slate-200">
              <img
                src={gSrc}
                alt=""
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
        {unreadCount && unreadCount > 0 ? (
          <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#f44336] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs z-10">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        ) : null}
      </div>
    );
  }

  // Custom icon avatars matching specific preset agents
  if (name === '沈真') {
    return (
      <div className="relative inline-block flex-shrink-0">
        <div className={`${sizeClasses} rounded-full overflow-hidden bg-sky-50 flex items-center justify-center border border-sky-100 shadow-xs ${className}`}>
          <div className="w-full h-full bg-[#3b82f6]/10 flex items-center justify-center relative p-1 overflow-hidden rounded-full">
            <svg viewBox="0 0 100 100" className="w-full h-full rounded-full">
              <circle cx="50" cy="50" r="50" fill="#eff6ff" />
              <rect x="25" y="30" width="50" height="45" rx="15" fill="#2563eb" />
              <circle cx="40" cy="48" r="5" fill="#ffffff" />
              <circle cx="60" cy="48" r="5" fill="#ffffff" />
              <path d="M 42 60 Q 50 67 58 60" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
              <path d="M 30 20 L 40 32 L 20 32 Z" fill="#60a5fa" />
              <path d="M 70 20 L 80 32 L 60 32 Z" fill="#60a5fa" />
            </svg>
          </div>
        </div>
        {unreadCount && unreadCount > 0 ? (
          <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#f44336] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs z-10">
            {unreadCount}
          </div>
        ) : null}
      </div>
    );
  }

  if (name === '智数') {
    return (
      <div className="relative inline-block flex-shrink-0">
        <div className={`${sizeClasses} rounded-full overflow-hidden bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-xs ${className}`}>
          <div className="border border-white/40 p-1.5 rounded-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
        </div>
        {unreadCount && unreadCount > 0 ? (
          <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#f44336] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs z-10">
            {unreadCount}
          </div>
        ) : null}
      </div>
    );
  }

  const avatarChar = getAvatarChar(name);
  const bgClass = getAvatarBgClass(name);
  const hasPhoto = Boolean(src && !imgError);

  // Standard Avatar - Photo or Colored Text Avatar (Surname / Capital Initial)
  return (
    <div className="relative inline-block flex-shrink-0 select-none">
      <div
        className={`${sizeClasses} rounded-full overflow-hidden flex items-center justify-center shadow-2xs ${
          hasPhoto ? 'bg-slate-100 border border-slate-200/80' : `${bgClass} text-white font-bold tracking-tight border border-white/20`
        } ${className}`}
      >
        {hasPhoto ? (
          <img
            src={src}
            alt={name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className={`${fontSizeClasses} font-bold leading-none text-white drop-shadow-2xs`}>
            {avatarChar}
          </span>
        )}
      </div>
      {unreadCount && unreadCount > 0 ? (
        <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-[#f44336] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs z-10">
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      ) : null}
    </div>
  );
};
