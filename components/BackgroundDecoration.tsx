import React from 'react';

export const BackgroundDecoration: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
      {/* 1. Ambient Blurred Gradient Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-rose-200/40 via-pink-100/30 to-transparent blur-3xl" />
      <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-pink-300/30 via-rose-200/20 to-transparent blur-3xl" />
      <div className="absolute bottom-10 left-1/3 w-[600px] h-[400px] rounded-full bg-gradient-to-tr from-pink-100/40 via-rose-50/30 to-transparent blur-3xl" />

      {/* 2. Delicate Luxury Architectural Pattern Overlay (Subtle dot matrix texture) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          <pattern
            id="dxn-luxury-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="#921740" />
            <path
              d="M16 0L32 16L16 32L0 16Z"
              fill="none"
              stroke="#921740"
              strokeWidth="0.5"
              strokeDasharray="2 4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dxn-luxury-grid)" />
      </svg>

      {/* 3. Oversized Elegant Luxury Emblem Watermark in the corner */}
      <div className="absolute -bottom-20 -right-20 w-[450px] h-[450px] opacity-[0.03] select-none text-royal-pink font-serif font-black flex items-center justify-center text-[380px] leading-none pointer-events-none">
        D
      </div>
    </div>
  );
};

