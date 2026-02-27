import { useState } from 'react';

interface FlagImageProps {
  code: string;          // ISO 3166-1 alpha-2 lowercase
  fallbackEmoji: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  sm: { w: 160, cls: 'h-8' },
  md: { w: 160, cls: 'h-12' },
  lg: { w: 320, cls: 'h-16' },
  xl: { w: 320, cls: 'h-20' },
};

export default function FlagImage({ code, fallbackEmoji, size = 'md', className = '' }: FlagImageProps) {
  const [error, setError] = useState(false);
  const s = SIZE_MAP[size];

  if (error || !code) {
    const emojiSize = { sm: 'text-2xl', md: 'text-4xl', lg: 'text-6xl', xl: 'text-7xl' }[size];
    return <span className={`${emojiSize} leading-none ${className}`}>{fallbackEmoji}</span>;
  }

  return (
    <img
      src={`https://flagcdn.com/w${s.w}/${code}.png`}
      alt={code.toUpperCase()}
      className={`${s.cls} object-contain rounded shadow-sm ${className}`}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}
