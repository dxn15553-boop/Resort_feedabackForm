import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-pink-100/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-18 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          {/* DXN Royal Emblem */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-dxn-900 via-royal-pink to-pink-500 flex items-center justify-center shadow-soft text-white font-serif font-black text-lg sm:text-xl tracking-wider transition-transform group-hover:scale-105 shrink-0">
            D
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-base sm:text-xl font-bold tracking-tight text-slate-900">
              DXN RESORT
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500">
              Guest Feedback
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/admin/login"
            className="text-xs font-semibold text-royal-pink hover:text-royal-pinkDark hover:underline px-2.5 py-1.5 rounded-lg bg-pink-50/70 hover:bg-pink-100/80 border border-pink-200 transition-colors flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>
        </div>
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

