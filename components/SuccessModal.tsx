'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

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
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-card text-center max-w-md mx-auto">
      {/* Clean circular check icon */}
      <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
        <Check className="w-7 h-7 stroke-[2.5]" />
      </div>

      <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 mb-1">
        Thank You{guestName ? `, ${guestName}` : ''}!
      </h2>

      <p className="text-xs sm:text-sm text-slate-600 mb-5">
        Your feedback for <span className="font-semibold text-slate-800">Room {roomNumber || '–'}</span> has been received.
      </p>

      {/* Clean Reference ID snippet */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 mb-5 flex items-center justify-between gap-3">
        <div className="text-left">
          <span className="block text-[10px] uppercase font-bold text-slate-400">Reference ID</span>
          <span className="font-mono text-sm font-bold text-royal-pink">
            {feedbackId}
          </span>
        </div>
        <button
          type="button"
          onClick={copyId}
          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Action button */}
      <button
        type="button"
        onClick={onReset}
        className="w-full py-2.5 px-5 rounded-xl bg-royal-pink text-white font-semibold text-sm hover:bg-royal-pinkHover shadow-soft transition-all"
      >
        Submit Another Feedback
      </button>
    </div>
  );
};
