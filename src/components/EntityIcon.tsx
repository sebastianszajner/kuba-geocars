import { useState } from 'react';

interface EntityIconProps {
  emoji: string;
  iconUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  sm: { img: 'w-8 h-8', emoji: 'text-2xl' },
  md: { img: 'w-12 h-12', emoji: 'text-4xl' },
  lg: { img: 'w-16 h-16', emoji: 'text-5xl' },
  xl: { img: 'w-20 h-20', emoji: 'text-6xl' },
};

export default function EntityIcon({ emoji, iconUrl, size = 'md', className = '' }: EntityIconProps) {
  const [imgError, setImgError] = useState(false);
  const s = SIZE_MAP[size];

  if (iconUrl && !imgError) {
    const src = iconUrl.startsWith('http') ? iconUrl : `${import.meta.env.BASE_URL}${iconUrl.replace(/^\//, '')}`;
    return (
      <img
        src={src}
        alt=""
        className={`${s.img} object-contain rounded-lg ${className}`}
        onError={() => setImgError(true)}
        loading="lazy"
      />
    );
  }

  return <span className={`${s.emoji} leading-none ${className}`}>{emoji}</span>;
}
