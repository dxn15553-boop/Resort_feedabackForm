import React from 'react';

export const BackgroundDecoration: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
      {/* 1. Richer Ambient Aurora Glow Orbs (Enhanced lighting & depth) */}
      <div className="absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-rose-400/40 via-pink-300/30 to-transparent blur-3xl animate-float-slow" />
      <div className="absolute top-1/4 -right-48 w-[750px] h-[750px] rounded-full bg-gradient-to-bl from-pink-400/35 via-rose-200/25 to-transparent blur-3xl animate-float-reverse" />
      <div className="absolute -bottom-24 left-1/4 w-[850px] h-[600px] rounded-full bg-gradient-to-tr from-rose-300/40 via-pink-100/50 to-transparent blur-3xl animate-pulse-soft" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] rounded-full bg-radial from-rose-100/40 via-pink-50/20 to-transparent blur-2xl" />

      {/* 2. Modern Architectural Dot Grid Overlay (Crisper & more visible) */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `radial-gradient(#921740 1.2px, transparent 1.2px)`,
          backgroundSize: '24px 24px',
          maskImage: 'radial-gradient(ellipse at 50% 35%, black 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 35%, black 40%, transparent 85%)',
        }}
      />

      {/* 3. Rich Modern Topographic Resort Contour Waves & Ribbons */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.11]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="dxn-wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C2185B" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#921740" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C2185B" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="dxn-wave-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#921740" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="dxn-fill-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C2185B" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Soft wave area fill */}
        <path
          d="M-100,240 C220,340 500,140 820,280 C1140,420 1340,200 1600,300 L1600,600 C1300,500 1000,700 700,550 C400,400 100,580 -100,500 Z"
          fill="url(#dxn-fill-grad)"
        />

        {/* Dynamic primary wave strokes */}
        <path
          d="M-100,180 C200,280 440,80 760,220 C1080,360 1300,140 1600,240"
          fill="none"
          stroke="url(#dxn-wave-grad-1)"
          strokeWidth="2"
          strokeDasharray="4 6"
        />
        <path
          d="M-100,240 C220,340 500,140 820,280 C1140,420 1340,200 1600,300"
          fill="none"
          stroke="url(#dxn-wave-grad-1)"
          strokeWidth="1.8"
        />
        <path
          d="M-100,360 C280,480 580,240 900,400 C1220,560 1380,300 1600,420"
          fill="none"
          stroke="url(#dxn-wave-grad-2)"
          strokeWidth="1.5"
          strokeDasharray="8 6"
        />
        <path
          d="M-100,440 C320,540 620,320 940,460 C1260,600 1420,360 1600,480"
          fill="none"
          stroke="#921740"
          strokeWidth="1.2"
        />
        <path
          d="M-100,580 C240,700 560,480 880,640 C1200,800 1420,560 1600,660"
          fill="none"
          stroke="url(#dxn-wave-grad-1)"
          strokeWidth="1.6"
          strokeDasharray="5 7"
        />
        <path
          d="M-100,660 C300,780 640,560 960,700 C1280,840 1460,620 1600,740"
          fill="none"
          stroke="#C2185B"
          strokeWidth="1.4"
        />
        <path
          d="M-100,760 C340,860 680,660 1020,800 C1360,940 1480,760 1600,840"
          fill="none"
          stroke="url(#dxn-wave-grad-2)"
          strokeWidth="1.8"
        />
      </svg>

      {/* 4. Luxury Concentric Resort Zen Rings & Halo Accents */}
      {/* Top Right Ripple Group */}
      <div className="absolute top-12 right-6 md:right-20 w-80 h-80 rounded-full border border-pink-400/25 opacity-70 animate-pulse-soft pointer-events-none" />
      <div className="absolute top-20 right-14 md:right-28 w-64 h-64 rounded-full border border-rose-400/20 opacity-60 pointer-events-none" />
      <div className="absolute top-28 right-22 md:right-36 w-48 h-48 rounded-full border border-pink-500/25 border-dashed opacity-50 pointer-events-none" />
      <div className="absolute top-36 right-30 md:right-44 w-32 h-32 rounded-full border border-royal-pink/20 opacity-40 pointer-events-none" />

      {/* Bottom Left Ripple Group */}
      <div className="absolute bottom-20 left-6 md:left-16 w-96 h-96 rounded-full border border-rose-400/25 opacity-60 animate-pulse-soft pointer-events-none" />
      <div className="absolute bottom-28 left-14 md:left-24 w-80 h-80 rounded-full border border-pink-400/20 border-dashed opacity-50 pointer-events-none" />
      <div className="absolute bottom-36 left-22 md:left-32 w-64 h-64 rounded-full border border-pink-500/20 opacity-40 pointer-events-none" />
      <div className="absolute bottom-44 left-30 md:left-40 w-48 h-48 rounded-full border border-royal-pink/20 opacity-30 pointer-events-none" />

      {/* Center Left Subtle Accent */}
      <div className="hidden md:block absolute top-1/2 -left-20 w-72 h-72 rounded-full border border-rose-300/20 border-dotted opacity-40 pointer-events-none" />

      {/* 5. Modern Fine Corner Sparkle Stars & Crosshairs */}
      <div className="hidden sm:block absolute top-24 left-12 text-pink-400/60 text-2xl font-light select-none animate-pulse-soft">
        ✦
      </div>
      <div className="hidden sm:block absolute top-36 left-28 text-rose-300/50 text-base font-light select-none">
        ✧
      </div>
      <div className="hidden sm:block absolute top-64 right-16 text-rose-400/60 text-3xl font-light select-none animate-pulse-soft">
        ✦
      </div>
      <div className="hidden sm:block absolute top-80 right-32 text-pink-300/50 text-lg font-light select-none">
        ⋆
      </div>
      <div className="hidden sm:block absolute bottom-72 left-20 text-rose-400/50 text-2xl font-light select-none">
        ✦
      </div>
      <div className="hidden sm:block absolute bottom-48 left-36 text-pink-300/60 text-lg font-light select-none">
        ✧
      </div>
      <div className="hidden sm:block absolute bottom-36 right-24 text-rose-400/60 text-2xl font-light select-none animate-pulse-soft">
        ✦
      </div>
      <div className="hidden sm:block absolute bottom-56 right-40 text-pink-300/50 text-base font-light select-none">
        ⋆
      </div>

      {/* 6. Subtle DXN Luxury Brand Silhouette Watermark in corner */}
      <div className="absolute -bottom-16 -right-16 w-80 h-80 opacity-[0.045] select-none text-royal-pink font-serif font-black flex items-center justify-center text-[340px] leading-none pointer-events-none">
        D
      </div>
    </div>
  );
};
