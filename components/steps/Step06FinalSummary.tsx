'use client';

import React from 'react';
import { AmbassadorStatus, FeedbackFormData } from '@/lib/types';
import { HeartHandshake, MessageSquareQuote, CheckCircle, ThumbsUp, ThumbsDown, Award } from 'lucide-react';

interface Step06Props {
  data: FeedbackFormData;
  updateData: (fields: Partial<FeedbackFormData>) => void;
  errors: Record<string, string>;
}

export const Step06FinalSummary: React.FC<Step06Props> = ({ data, updateData, errors }) => {
  return (
    <div className="space-y-6">
      {/* Multiline Text Area */}
      <div className="bg-slate-50/50 rounded-2xl p-4 sm:p-5 border border-pink-100/60">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-pink-100 text-royal-pink flex items-center justify-center">
            <MessageSquareQuote className="w-4 h-4" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-900">
              How can we refine your experience next time? <span className="text-rose-600 font-bold">*</span>
            </label>
            <p className="text-xs text-slate-500">
              Please share any specific suggestions, appreciations, or areas where we could delight you more.
            </p>
          </div>
        </div>

        <div className="mt-3">
          <textarea
            rows={4}
            value={data.refinementText}
            onChange={(e) => updateData({ refinementText: e.target.value })}
            placeholder="Type your personal observations, special requests, or suggestions here..."
            className={`w-full p-3.5 rounded-xl border bg-white text-slate-900 text-sm focus:outline-none transition-all resize-y ${
              errors.refinementText
                ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                : 'border-slate-200 focus:border-royal-pink focus:ring-2 focus:ring-royal-pink/15'
            }`}
          />
          {errors.refinementText && (
            <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              {errors.refinementText}
            </p>
          )}
        </div>
      </div>

      {/* Staff Recognition / Compliment (Optional) */}
      <div className="bg-slate-50/50 rounded-2xl p-4 sm:p-5 border border-pink-100/60">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-pink-100 text-royal-pink flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-900">
              Staff Recognition & Compliments <span className="text-xs font-normal text-slate-500">(Optional)</span>
            </label>
            <p className="text-xs text-slate-500">
              Did any team member make your stay special? Share their name or department so we can recognize them.
            </p>
          </div>
        </div>

        <div className="mt-3">
          <input
            type="text"
            value={data.staffCompliment || ''}
            onChange={(e) => updateData({ staffCompliment: e.target.value })}
            placeholder="e.g. Chef, Receptionist, or Housekeeping team"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:border-royal-pink focus:ring-2 focus:ring-royal-pink/15 transition-all"
          />
        </div>
      </div>

      {/* Ambassador Status */}
      <div className="bg-gradient-to-br from-pink-50/80 via-white to-pink-50/40 rounded-2xl p-5 border border-pink-200/80 shadow-soft">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-royal-pink text-white flex items-center justify-center shrink-0 shadow-xs">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Ambassador Status</h3>
            <p className="text-sm text-slate-800 mt-0.5 font-medium">
              Would you recommend DXN Resort to others? <span className="text-rose-600 font-bold">*</span>
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Your endorsement shapes our global hospitality reputation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Absolutely */}
          <button
            type="button"
            onClick={() => updateData({ ambassadorStatus: 'Absolutely' })}
            className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
              data.ambassadorStatus === 'Absolutely'
                ? 'border-royal-pink bg-white ring-2 ring-royal-pink/20 shadow-sm font-medium'
                : 'bg-white/80 border-slate-200 hover:border-pink-300 hover:bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  data.ambassadorStatus === 'Absolutely'
                    ? 'bg-pink-100 text-royal-pink'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 block">Absolutely</span>
                <span className="text-xs text-slate-500">I would gladly recommend DXN Resort</span>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                data.ambassadorStatus === 'Absolutely'
                  ? 'border-royal-pink bg-royal-pink text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {data.ambassadorStatus === 'Absolutely' && <CheckCircle className="w-4 h-4" />}
            </div>
          </button>

          {/* Not Likely */}
          <button
            type="button"
            onClick={() => updateData({ ambassadorStatus: 'Not Likely' })}
            className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
              data.ambassadorStatus === 'Not Likely'
                ? 'border-rose-400 bg-white ring-2 ring-rose-200 shadow-sm font-medium'
                : 'bg-white/80 border-slate-200 hover:border-pink-300 hover:bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  data.ambassadorStatus === 'Not Likely'
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <ThumbsDown className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 block">Not Likely</span>
                <span className="text-xs text-slate-500">Hesitant to recommend at this time</span>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                data.ambassadorStatus === 'Not Likely'
                  ? 'border-rose-500 bg-rose-500 text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {data.ambassadorStatus === 'Not Likely' && <CheckCircle className="w-4 h-4" />}
            </div>
          </button>
        </div>

        {errors.ambassadorStatus && (
          <p className="mt-3 text-xs text-rose-600 font-semibold">{errors.ambassadorStatus}</p>
        )}
      </div>
    </div>
  );
};

