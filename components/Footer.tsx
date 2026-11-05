import React from 'react';
import { Lock, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto py-6 bg-white/80 border-t border-pink-100 text-slate-500 text-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-slate-500">
          <Lock className="w-3.5 h-3.5 text-royal-pink shrink-0" />
          <span>Secure guest feedback submission</span>
        </div>
        <div className="flex items-center justify-center gap-1 text-slate-400">
          <span>&copy; {new Date().getFullYear()} DXN Resort Management. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

