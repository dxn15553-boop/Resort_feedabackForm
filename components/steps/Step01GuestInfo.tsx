'use client';

import React from 'react';
import { FeedbackFormData, PurposeOfVisit, RatingValue } from '@/lib/types';
import { RatingCardGroup } from '../RatingCardGroup';
import { User, KeyRound, Calendar, Compass } from 'lucide-react';

interface Step01Props {
  data: FeedbackFormData;
  updateData: (fields: Partial<FeedbackFormData>) => void;
  errors: Record<string, string>;
}

const PURPOSES: { value: PurposeOfVisit; label: string; desc: string }[] = [
  { value: 'Family Leisure', label: 'Family Leisure', desc: 'Vacation, holiday, or family retreat' },
  { value: 'Corporate Business', label: 'Corporate Business', desc: 'Meetings, conferences, work retreat' },
  { value: 'Factory Inspection', label: 'Factory Inspection', desc: 'DXN industrial tour, audit, inspection' },
  { value: 'Other Reasons', label: 'Other Reasons', desc: 'Wellness, private events, personal trip' },
];

export const Step01GuestInfo: React.FC<Step01Props> = ({ data, updateData, errors }) => {
  return (
    <div className="space-y-6">
      {/* Grid of Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Full Name <span className="text-rose-600 font-bold">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => updateData({ fullName: e.target.value })}
              placeholder="e.g. Dr. Jane Smith"
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border bg-white text-slate-900 text-sm focus:outline-none transition-all ${
                errors.fullName
                  ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                  : 'border-slate-200 focus:border-royal-pink focus:ring-2 focus:ring-royal-pink/15'
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.fullName}</p>
          )}
        </div>

        {/* Room Number */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1.5">
            Room Number <span className="text-rose-600 font-bold">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={data.roomNumber}
              onChange={(e) => updateData({ roomNumber: e.target.value })}
              placeholder="e.g. Villa 204 or Room 512"
              className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border bg-white text-slate-900 text-sm focus:outline-none transition-all ${
                errors.roomNumber
                  ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                  : 'border-slate-200 focus:border-royal-pink focus:ring-2 focus:ring-royal-pink/15'
              }`}
            />
          </div>
          {errors.roomNumber && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.roomNumber}</p>
          )}
        </div>
      </div>

      {/* Visit Date */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-1.5">
          Visit Date <span className="text-rose-600 font-bold">*</span>
        </label>
        <div className="relative sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Calendar className="w-4 h-4" />
          </div>
          <input
            type="date"
            value={data.visitDate}
            onChange={(e) => updateData({ visitDate: e.target.value })}
            className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border bg-white text-slate-900 text-sm focus:outline-none transition-all ${
              errors.visitDate
                ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                : 'border-slate-200 focus:border-royal-pink focus:ring-2 focus:ring-royal-pink/15'
            }`}
          />
        </div>
        {errors.visitDate && (
          <p className="mt-1 text-xs text-rose-600 font-medium">{errors.visitDate}</p>
        )}
      </div>

      {/* Purpose of Visit */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          Purpose of Visit <span className="text-rose-600 font-bold">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PURPOSES.map((p) => {
            const isSelected = data.purposeOfVisit === p.value;
            return (
              <button
                key={p.value}
                type="button"
                onClick={() => updateData({ purposeOfVisit: p.value })}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'border-royal-pink bg-pink-50/70 ring-2 ring-royal-pink/15 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-pink-300 hover:bg-pink-50/30'
                }`}
              >
                <div
                  className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'border-royal-pink bg-royal-pink text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </div>
                <div>
                  <div className={`text-sm font-semibold ${isSelected ? 'text-slate-900' : 'text-slate-800'}`}>
                    {p.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{p.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
        {errors.purposeOfVisit && (
          <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.purposeOfVisit}</p>
        )}
      </div>

      {/* Overall Impression (Selectable rating cards) */}
      <div className="pt-2 border-t border-pink-50">
        <RatingCardGroup
          label="Overall Impression"
          required
          value={data.overallImpression as RatingValue}
          onChange={(val) => updateData({ overallImpression: val })}
          error={errors.overallImpression}
          categoryTag="General Experience"
        />
      </div>
    </div>
  );
};

