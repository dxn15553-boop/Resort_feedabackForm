import React from 'react';

export const BackgroundDecoration: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
      {/* 1. Modern Ambient Aurora Glow Orbs (Soft, flowing lighting) */}
      <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-rose-300/35 via-pink-200/25 to-transparent blur-3xl animate-float-slow" />
      <div className="absolute top-1/4 -right-40 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-pink-300/30 via-rose-100/20 to-transparent blur-3xl animate-float-reverse" />
      <div className="absolute bottom-10 left-1/4 w-[700px] h-[500px] rounded-full bg-gradient-to-tr from-rose-200/30 via-pink-50/40 to-transparent blur-3xl animate-pulse-soft" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[600px] rounded-full bg-radial from-white/60 via-pink-50/20 to-transparent blur-2xl" />

      {/* 2. Modern Precision Dot Grid with Vignette Mask (Fades smoothly to edges) */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(#921740 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at 50% 30%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, black 20%, transparent 80%)',
        }}
      />

      {/* 3. Modern Organic Resort Contour Waves (Topographic luxury aesthetics) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.045]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <path
          d="M-100,220 C240,320 480,100 800,260 C1120,420 1320,180 1600,280"
          fill="none"
          stroke="#C2185B"
          strokeWidth="1.5"
          strokeDasharray="6 8"
        />
        <path
          d="M-100,380 C320,480 600,260 920,420 C1240,580 1400,320 1600,440"
          fill="none"
          stroke="#921740"
          strokeWidth="1.2"
        />
        <path
          d="M-100,560 C260,680 580,480 900,620 C1220,760 1440,540 1600,640"
          fill="none"
          stroke="#C2185B"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <path
          d="M-100,720 C360,820 680,620 1020,760 C1360,900 1480,720 1600,800"
          fill="none"
          stroke="#921740"
          strokeWidth="1.2"
        />
      </svg>

      {/* 4. Modern Subtle Luxury Accents (Concentric resort zen ripples & subtle badge) */}
      <div className="absolute top-16 right-8 md:right-24 w-64 h-64 rounded-full border border-pink-300/20 opacity-40 animate-pulse-soft pointer-events-none" />
      <div className="absolute top-24 right-16 md:right-32 w-48 h-48 rounded-full border border-pink-400/15 opacity-40 pointer-events-none" />
      <div className="absolute bottom-28 left-8 md:left-20 w-80 h-80 rounded-full border border-pink-300/20 opacity-30 pointer-events-none" />

      {/* 5. Modern Fine Corner Sparkle Crosshairs */}
      <div className="hidden lg:block absolute top-28 left-16 text-pink-300/40 text-xl font-light select-none">
        ✦
      </div>
      <div className="hidden lg:block absolute top-72 right-20 text-rose-300/35 text-2xl font-light select-none">
        ✦
      </div>
      <div className="hidden lg:block absolute bottom-40 right-32 text-pink-300/30 text-lg font-light select-none">
        ✧
      </div>
      <div className="hidden lg:block absolute bottom-64 left-24 text-rose-300/35 text-xl font-light select-none">
        ✧
      </div>
    </div>
  );
};
