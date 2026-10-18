import React from 'react';
import { useApp } from '../../context/AppContext';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  whiteText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  whiteText = false,
}) => {
  const { settings } = useApp();
  const siteName = settings?.general?.siteName || 'Turtle Buddy';
  const logoUrl = settings?.general?.logoUrl;

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold tracking-tight',
    lg: 'text-2xl font-black tracking-tight',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={siteName}
          className={`${iconSizes[size]} object-contain rounded-lg`}
        />
      ) : (
        <div
          className={`${iconSizes[size]} rounded-xl flex items-center justify-center text-white shadow-sm shrink-0`}
          style={{ backgroundColor: 'var(--tb-primary, #0284c7)' }}
        >
          {/* Stylized friendly Turtle SVG mark */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5/6 h-5/6"
          >
            {/* Turtle Shell */}
            <ellipse cx="12" cy="13" rx="7" ry="5.5" fill="currentColor" fillOpacity="0.25" />
            <path d="M12 7.5c-3.86 0-7 2.46-7 5.5s3.14 5.5 7 5.5 7-2.46 7-5.5-3.14-5.5-7-5.5z" />
            {/* Head */}
            <circle cx="12" cy="5" r="2.2" />
            {/* Flippers */}
            <path d="M6 10c-1.5-.5-2.5 1-2.5 2" />
            <path d="M18 10c1.5-.5 2.5 1 2.5 2" />
            <path d="M7 16c-1.2.8-1.8 2.2-1.5 3" />
            <path d="M17 16c1.2.8 1.8 2.2 1.5 3" />
            {/* Shell Pattern */}
            <path d="M12 9.5v7M8.5 11.5l7 3M15.5 11.5l-7 3" opacity="0.6" strokeWidth="1.5" />
          </svg>
        </div>
      )}
      <div className="flex flex-col">
        <span
          className={`${textSizes[size]} leading-none`}
          style={{ color: whiteText ? '#ffffff' : 'var(--tb-heading, #0f172a)' }}
        >
          {siteName}
        </span>
        <span
          className="text-[10px] font-semibold tracking-wider uppercase mt-0.5 leading-none opacity-80"
          style={{ color: whiteText ? '#cbd5e1' : 'var(--tb-secondary, #f97316)' }}
        >
          Therapy & Learning
        </span>
      </div>
    </div>
  );
};
