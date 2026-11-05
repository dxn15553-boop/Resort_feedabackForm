import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-pink-100/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 sm:h-16 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Feedback Form
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/login"
            className="text-xs font-semibold text-royal-pink hover:text-royal-pinkDark hover:underline px-2.5 py-1.5 rounded-lg bg-pink-50/70 hover:bg-pink-100/80 border border-pink-200 transition-colors flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
