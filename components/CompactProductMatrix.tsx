'use client';

import React from 'react';
import { RatingValue } from '@/lib/types';
import { Star, Smile, Meh, Frown, Check, Sparkles } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  value: RatingValue | '' | undefined;
  onChange: (val: RatingValue) => void;
  error?: string;
}

interface CompactProductMatrixProps {
  products: ProductItem[];
  onRateAll?: (rating: RatingValue) => void;
}

const RATING_TIERS: {
  value: RatingValue;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
}[] = [
  {
    value: 'Excellent',
    label: 'Excellent',
    shortLabel: 'Excell.',
    icon: Star,
    color: 'text-amber-500',
    activeBg: 'bg-gradient-to-r from-pink-50 to-rose-50',
    activeBorder: 'border-royal-pink ring-2 ring-royal-pink/20',
    activeText: 'text-royal-pinkDark font-bold',
  },
  {
    value: 'Good',
    label: 'Good',
    shortLabel: 'Good',
    icon: Smile,
    color: 'text-emerald-500',
    activeBg: 'bg-emerald-50',
    activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20',
    activeText: 'text-emerald-800 font-bold',
  },
  {
    value: 'Average',
    label: 'Average',
    shortLabel: 'Avg.',
    icon: Meh,
    color: 'text-sky-500',
    activeBg: 'bg-sky-50',
    activeBorder: 'border-sky-500 ring-2 ring-sky-500/20',
    activeText: 'text-sky-800 font-bold',
  },
  {
    value: 'Poor',
    label: 'Poor',
    shortLabel: 'Poor',
    icon: Frown,
    color: 'text-rose-500',
    activeBg: 'bg-rose-50',
    activeBorder: 'border-rose-400 ring-2 ring-rose-400/20',
    activeText: 'text-rose-800 font-bold',
  },
];

export const CompactProductMatrix: React.FC<CompactProductMatrixProps> = ({ products, onRateAll }) => {
  return (
    <div className="space-y-3">
      {/* Quick rating shortcuts header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-pink-100/70 text-xs">
        <span className="text-slate-500 font-medium">
          Select a rating for each amenity provided during your stay:
        </span>
        {onRateAll && (
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mr-1">
              Quick Set:
            </span>
            <button
              type="button"
              onClick={() => onRateAll('Excellent')}
              className="px-2 py-0.5 rounded-md bg-pink-50 hover:bg-pink-100 text-royal-pink text-[11px] font-semibold border border-pink-200 transition-colors flex items-center gap-1"
            >
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>All Excellent</span>
            </button>
            <button
              type="button"
              onClick={() => onRateAll('Good')}
              className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold border border-emerald-200 transition-colors flex items-center gap-1"
            >
              <Smile className="w-3 h-3 text-emerald-500" />
              <span>All Good</span>
            </button>
          </div>
        )}
      </div>

      {/* Desktop / Tablet Matrix View (Hidden on very small screens, displayed on sm+) */}
      <div className="hidden sm:block overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-2xs">
        <div className="grid grid-cols-12 bg-pink-50/60 px-4 py-2.5 text-xs font-bold text-slate-700 border-b border-pink-100">
          <div className="col-span-4">DXN Product</div>
          <div className="col-span-8 grid grid-cols-4 gap-2 text-center">
            {RATING_TIERS.map((tier) => {
              const Icon = tier.icon;
              return (
                <div key={tier.value} className="flex items-center justify-center gap-1 text-[11px]">
                  <Icon className={`w-3.5 h-3.5 ${tier.color}`} />
                  <span>{tier.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {products.map((p) => (
            <div
              key={p.id}
              className={`grid grid-cols-12 items-center px-4 py-2 hover:bg-pink-50/20 transition-colors ${
                p.error ? 'bg-rose-50/30' : ''
              }`}
            >
              <div className="col-span-4 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">{p.name}</span>
                  <span className="text-[10px] text-royal-pink font-medium bg-pink-50 px-1.5 py-0.5 rounded border border-pink-100">
                    {p.category}
                  </span>
                </div>
                {p.error && (
                  <p className="text-[11px] text-rose-600 font-medium mt-0.5">{p.error}</p>
                )}
              </div>

              <div className="col-span-8 grid grid-cols-4 gap-2">
                {RATING_TIERS.map((tier) => {
                  const isSelected = p.value === tier.value;
                  const Icon = tier.icon;

                  return (
                    <button
                      key={tier.value}
                      type="button"
                      onClick={() => p.onChange(tier.value)}
                      className={`h-9 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? `${tier.activeBg} ${tier.activeBorder} ${tier.activeText} shadow-2xs`
                          : 'bg-white border-slate-200 text-slate-600 hover:border-pink-300 hover:bg-pink-50/30'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? tier.color : 'text-slate-400'}`} />
                      <span>{tier.label}</span>
                      {isSelected && <Check className="w-3 h-3 stroke-[3] ml-0.5 text-royal-pink" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile-Optimized Compact List (Displayed only on xs) */}
      <div className="sm:hidden space-y-2">
        {products.map((p) => (
          <div
            key={p.id}
            className={`p-3 rounded-xl border bg-white shadow-2xs transition-all ${
              p.error ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-900">{p.name}</span>
              <span className="text-[10px] text-royal-pink font-medium bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">
                {p.category}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {RATING_TIERS.map((tier) => {
                const isSelected = p.value === tier.value;
                const Icon = tier.icon;

                return (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => p.onChange(tier.value)}
                    className={`py-1.5 px-1 rounded-lg border text-center text-[11px] font-medium flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? `${tier.activeBg} ${tier.activeBorder} ${tier.activeText} shadow-2xs`
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 mb-0.5 ${isSelected ? tier.color : 'text-slate-400'}`} />
                    <span className="truncate">{tier.shortLabel}</span>
                  </button>
                );
              })}
            </div>

            {p.error && (
              <p className="text-[11px] text-rose-600 font-medium mt-1.5">{p.error}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

