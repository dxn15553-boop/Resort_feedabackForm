'use client';

import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
  stepTitles: { number: number; label: string }[];
  isStepSkipped?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps = 6,
  stepTitles,
}) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full pb-6 mb-6 border-b border-pink-100/80">
      {/* Top row: step count and percentage */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="inline-flex items-center justify-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-gradient-to-r from-pink-600 to-royal-pink text-white shadow-xs shrink-0">
            STEP 0{currentStep}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
            {stepTitles.find((s) => s.number === currentStep)?.label || `Step ${currentStep}`}
          </span>
        </div>
        <div className="text-[11px] sm:text-xs font-semibold text-slate-500 shrink-0">
          <span className="text-royal-pink font-bold">{currentStep}</span> of {totalSteps} ({percentage}%)
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2.5 bg-pink-100/60 rounded-full overflow-hidden p-0.5 border border-pink-200/50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-royal-pink transition-all duration-300 ease-out shadow-xs"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step Dots & Labels for larger screens */}
      <div className="hidden sm:grid grid-cols-6 gap-1 mt-3 pt-2 text-center">
        {stepTitles.map((step) => {
          const isDone = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <div key={step.number} className="flex flex-col items-center">
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider ${
                  isCurrent
                    ? 'text-royal-pink font-bold'
                    : isDone
                    ? 'text-emerald-700'
                    : 'text-slate-400'
                }`}
              >
                0{step.number}
              </span>
              <span
                className={`text-[11px] truncate max-w-[85px] ${
                  isCurrent
                    ? 'text-slate-900 font-bold'
                    : isDone
                    ? 'text-slate-600'
                    : 'text-slate-400'
                }`}
                title={step.label}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

