'use client';

import React, { useState } from 'react';
import { Check, Copy, Award, Home, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface SuccessModalProps {
  feedbackId: string;
  guestName: string;
  roomNumber: string;
  onReset: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  feedbackId,
  guestName,
  roomNumber,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(feedbackId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-white/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] text-center max-w-xl mx-auto">
      {/* Decorative success badge */}
      <div className="mx-auto w-18 h-18 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-lg mb-6">
        <Check className="w-10 h-10 stroke-[2.5]" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-royal-pink border border-pink-100 mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Submission Confirmed & Safely Recorded</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-2">
        Thank You, {guestName || 'Valued Guest'}!
      </h2>

      <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
        Your feedback for <span className="font-semibold text-slate-800">Room {roomNumber || '–'}</span> has been permanently stored in our guest experience database. We deeply appreciate your time in helping DXN Resort uphold world-class hospitality.
      </p>

      {/* Unique Feedback ID Card */}
      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 mb-8 max-w-sm mx-auto">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
          <span>Official Feedback Reference ID</span>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold">VERIFIED</span>
        </div>
        <div className="flex items-center justify-between gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200">
          <span className="font-mono text-base font-bold text-royal-pink tracking-wider">
            {feedbackId}
          </span>
          <button
            type="button"
            onClick={copyId}
            className="p-1.5 hover:bg-pink-50 rounded-lg text-slate-600 hover:text-royal-pink transition-colors flex items-center gap-1 text-xs"
            title="Copy Reference ID"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-royal-pink to-rose-600 text-white font-semibold text-sm hover:from-royal-pinkHover hover:to-rose-700 shadow-md hover:shadow-lg transition-all"
        >
          Submit Another Feedback
        </button>

        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

