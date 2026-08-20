import React from 'react';

interface AiAgentAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AiAgentAvatar: React.FC<AiAgentAvatarProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div
      className={`relative rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden shadow-xs bg-slate-900 border-2 border-indigo-100 ${sizeMap[size]} ${className}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          {/* Yellow eye glow filter */}
          <filter id="yellowGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {/* Pink cheek glow */}
          <filter id="pinkGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Head Background */}
        <circle cx="50" cy="50" r="48" fill="#090d16" />

        {/* Top Pink Ear / Antenna Dots */}
        <circle cx="36" cy="18" r="4" fill="#ff4081" filter="url(#pinkGlow)" />
        <circle cx="64" cy="18" r="4" fill="#ff4081" filter="url(#pinkGlow)" />

        {/* Soft Head Horizon / Inner reflection */}
        <ellipse cx="50" cy="24" rx="30" ry="12" fill="#1e293b" opacity="0.3" />

        {/* Glowing Yellow Eyes */}
        <g filter="url(#yellowGlow)">
          {/* Left Eye */}
          <ellipse cx="38" cy="50" rx="9" ry="11" fill="#facc15" />
          <ellipse cx="38" cy="50" rx="7" ry="9" fill="#fef08a" />
          <circle cx="40" cy="48" r="3" fill="#ffffff" />

          {/* Right Eye */}
          <ellipse cx="62" cy="50" rx="9" ry="11" fill="#facc15" />
          <ellipse cx="62" cy="50" rx="7" ry="9" fill="#fef08a" />
          <circle cx="64" cy="48" r="3" fill="#ffffff" />
        </g>

        {/* Pink Blush Spots */}
        <ellipse cx="37" cy="67" rx="5" ry="2.5" fill="#f43f5e" opacity="0.85" filter="url(#pinkGlow)" />
        <ellipse cx="63" cy="67" rx="5" ry="2.5" fill="#f43f5e" opacity="0.85" filter="url(#pinkGlow)" />
      </svg>
    </div>
  );
};
