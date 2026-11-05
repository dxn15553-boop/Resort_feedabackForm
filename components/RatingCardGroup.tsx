'use client';

import React from 'react';
import { RatingValue } from '@/lib/types';
import { Check, Star, Smile, Meh, Frown } from 'lucide-react';

interface RatingCardGroupProps {
  label: string;
  required?: boolean;
  value: RatingValue | '' | undefined;
  onChange: (val: RatingValue) => void;
  error?: string;
  categoryTag?: string;
}

const RATING_OPTIONS: {
  value: RatingValue;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  activeBg: string;
  activeBorder: string;
}[] = [
  {
    value: 'Excellent',
    label: 'Excellent',
    description: 'Exceeded expectations',
    icon: Star,
    color: 'text-amber-500',
    activeBg: 'bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100/70',
    activeBorder: 'border-royal-pink ring-2 ring-royal-pink/20',
  },
  {
    value: 'Good',
    label: 'Good',
    description: 'Satisfactory & pleasant',
    icon: Smile,
    color: 'text-emerald-500',
    activeBg: 'bg-emerald-50/50',
    activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20',
  },
  {
    value: 'Average',
    label: 'Average',
    description: 'Met basic needs',
    icon: Meh,
    color: 'text-sky-500',
    activeBg: 'bg-sky-50/50',
    activeBorder: 'border-sky-500 ring-2 ring-sky-500/20',
  },
  {
    value: 'Poor',
    label: 'Poor',
    description: 'Requires improvement',
    icon: Frown,
    color: 'text-rose-500',
    activeBg: 'bg-rose-50/50',
    activeBorder: 'border-rose-400 ring-2 ring-rose-400/20',
  },
];

export const RatingCardGroup: React.FC<RatingCardGroupProps> = ({
  label,
  required = true,
  value,
  onChange,
  error,
  categoryTag,
}) => {
  return (
    <div className="py-2.5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
          {label}
          {required && <span className="text-rose-600 font-bold" title="Mandatory">*</span>}
        </label>
        {categoryTag && (
          <span className="text-xs uppercase tracking-wider font-medium text-royal-pink bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">
            {categoryTag}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {RATING_OPTIONS.map((opt) => {
          const isSelected = value === opt.value;
          const Icon = opt.icon;

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl border text-left transition-all duration-150 ${
                isSelected
                  ? `${opt.activeBg} ${opt.activeBorder} shadow-sm font-medium`
                  : 'bg-white border-slate-200/80 hover:border-pink-300 hover:bg-pink-50/20 shadow-xs'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-royal-pink text-white flex items-center justify-center shadow-xs">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`w-4 h-4 ${opt.color} ${isSelected ? 'fill-current' : ''}`} />
                <span className={`text-sm ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>
                  {opt.label}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 text-center leading-tight">
                {opt.description}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          {error}
        </p>
      )}
    </div>
  );
};

