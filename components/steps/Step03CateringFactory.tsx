'use client';

import React from 'react';
import { FactoryVisitedOption, FeedbackFormData, RatingValue } from '@/lib/types';
import { RatingCardGroup } from '../RatingCardGroup';
import { Utensils, Factory, CheckCircle2, ArrowRight } from 'lucide-react';

interface Step03Props {
  data: FeedbackFormData;
  updateData: (fields: Partial<FeedbackFormData>) => void;
  errors: Record<string, string>;
}

export const Step03CateringFactory: React.FC<Step03Props> = ({ data, updateData, errors }) => {
  return (
    <div className="space-y-6">
      {/* F&B Performance */}
      <div className="bg-slate-50/50 rounded-2xl p-4 sm:p-5 border border-pink-100/60">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-pink-100/60">
          <div className="w-7 h-7 rounded-lg bg-pink-100 text-royal-pink flex items-center justify-center">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">F&B Performance</h3>
            <p className="text-xs text-slate-500">Culinary taste, presentation, dining quality, and in-room dining</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <RatingCardGroup
            label="Food Quality"
            value={data.foodQuality as RatingValue}
            onChange={(val) => updateData({ foodQuality: val })}
            error={errors.foodQuality}
          />
          <RatingCardGroup
            label="Room Service"
            value={data.roomService as RatingValue}
            onChange={(val) => updateData({ roomService: val })}
            error={errors.roomService}
          />
        </div>
      </div>

      {/* Factory Visit Identification */}
      <div className="bg-gradient-to-br from-pink-50/70 via-rose-50/40 to-white rounded-2xl p-5 border border-pink-200/80 shadow-soft">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-royal-pink text-white flex items-center justify-center shrink-0 shadow-xs">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Factory Visit Identification</h3>
            <p className="text-sm text-slate-700 mt-0.5 font-medium">
              Have you participated in any factory tours or inspections during this stay? <span className="text-rose-600 font-bold">*</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Selecting &ldquo;No, Skip&rdquo; will automatically bypass Step 04 (Industrial Experience).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Yes, Visited */}
          <button
            type="button"
            onClick={() => updateData({ factoryVisited: 'Yes, Visited' })}
            className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between ${
              data.factoryVisited === 'Yes, Visited'
                ? 'border-royal-pink bg-white ring-2 ring-royal-pink/20 shadow-sm'
                : 'bg-white/80 border-slate-200 hover:border-pink-300 hover:bg-white'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">Yes, Visited</span>
                {data.factoryVisited === 'Yes, Visited' && (
                  <span className="text-[10px] font-bold text-white bg-royal-pink px-2 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                I toured or inspected the DXN manufacturing and production facility. Proceed to Step 04.
              </p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                data.factoryVisited === 'Yes, Visited'
                  ? 'border-royal-pink bg-royal-pink text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {data.factoryVisited === 'Yes, Visited' && <CheckCircle2 className="w-4 h-4" />}
            </div>
          </button>

          {/* No, Skip */}
          <button
            type="button"
            onClick={() => updateData({ factoryVisited: 'No, Skip' })}
            className={`p-4 rounded-xl border text-left transition-all flex items-start justify-between ${
              data.factoryVisited === 'No, Skip'
                ? 'border-royal-pink bg-white ring-2 ring-royal-pink/20 shadow-sm'
                : 'bg-white/80 border-slate-200 hover:border-pink-300 hover:bg-white'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">No, Skip</span>
                {data.factoryVisited === 'No, Skip' && (
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full">
                    Skipping Step 04
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                I did not visit the factory. Directly advance to Step 05 (Products & Staff).
              </p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                data.factoryVisited === 'No, Skip'
                  ? 'border-royal-pink bg-royal-pink text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {data.factoryVisited === 'No, Skip' && <CheckCircle2 className="w-4 h-4" />}
            </div>
          </button>
        </div>

        {errors.factoryVisited && (
          <p className="mt-3 text-xs text-rose-600 font-semibold">{errors.factoryVisited}</p>
        )}
      </div>
    </div>
  );
};

