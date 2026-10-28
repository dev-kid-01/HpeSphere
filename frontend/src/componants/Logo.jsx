import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({
  variant = 'full', // 'full' | 'icon' | 'white'
  size = 'md',     // 'sm' | 'md' | 'lg'
  className = '',
  linkTo = '/',
}) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG Icon */}
      <div className={`relative flex-shrink-0 ${iconSizes[size] || iconSizes.md}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm transition-transform hover:scale-105 duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`hsGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F2B48" />
              <stop offset="50%" stopColor="#1E3A5F" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id={`hsEmerald-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id={`hsHeart-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>

          {/* Sphere Base */}
          <circle cx="50" cy="50" r="46" fill={`url(#hsGrad-${size})`} />
          
          {/* Subtle Grid / Longitude Line */}
          <ellipse cx="50" cy="50" rx="42" ry="17" fill="none" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="1.6" strokeDasharray="3 2" transform="rotate(-18 50 50)" />
          
          {/* Supportive Hands */}
          <path d="M 22 64 C 20 48, 30 38, 42 36 C 45 35, 48 38, 46 41 C 41 45, 34 50, 32 60 C 31 65, 25 70, 22 64 Z" fill={`url(#hsEmerald-${size})`} opacity="0.95" />
          <path d="M 78 64 C 80 48, 70 38, 58 36 C 55 35, 52 38, 54 41 C 59 45, 66 50, 68 60 C 69 65, 75 70, 78 64 Z" fill={`url(#hsEmerald-${size})`} opacity="0.95" />

          {/* Compassion Heart Center */}
          <path d="M 50 42 C 47 36, 39 37, 39 44 C 39 51, 48 57, 50 62 C 52 57, 61 51, 61 44 C 61 37, 53 36, 50 42 Z" fill={`url(#hsHeart-${size})`} />
          <circle cx="50" cy="34" r="2.2" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Text */}
      {variant !== 'icon' && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-extrabold tracking-tight ${textSizes[size] || textSizes.md} ${
              variant === 'white' ? 'text-white' : 'text-[#0F2B48]'
            }`}
          >
            Hope<span className="text-emerald-500">Sphere</span>
          </span>
          <span
            className={`text-[10px] tracking-widest font-semibold uppercase ${
              variant === 'white' ? 'text-emerald-300' : 'text-slate-500'
            }`}
          >
            Compassion In Action
          </span>
        </div>
      )}
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} aria-label="HopeSphere Home">
        {content}
      </Link>
    );
  }

  return content;
}
