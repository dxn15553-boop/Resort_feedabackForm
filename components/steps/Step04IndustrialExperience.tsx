'use client';

import React from 'react';
import { FeedbackFormData, RatingValue } from '@/lib/types';
import { RatingCardGroup } from '../RatingCardGroup';
import { Factory, ShieldAlert } from 'lucide-react';

interface Step04Props {
  data: FeedbackFormData;
  updateData: (fields: Partial<FeedbackFormData>) => void;
  errors: Record<string, string>;
}

export const Step04IndustrialExperience: React.FC<Step04Props> = ({ data, updateData, errors }) => {
  return (
    <div className="space-y-6">
      {/* Factory Metrics Container */}
      <div className="bg-slate-50/50 rounded-2xl p-4 sm:p-5 border border-pink-100/60">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-pink-100/60">
          <div className="w-7 h-7 rounded-lg bg-pink-100 text-royal-pink flex items-center justify-center">
            <Factory className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Factory Metrics</h3>
            <p className="text-xs text-slate-500">Evaluation of guided tour operations and manufacturing standards</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <RatingCardGroup
            label="Guided Tour Experience"
            value={data.guidedTourExperience as RatingValue}
            onChange={(val) => updateData({ guidedTourExperience: val })}
            error={errors.guidedTourExperience}
          />
          <RatingCardGroup
            label="Information Provided"
            value={data.informationProvided as RatingValue}
            onChange={(val) => updateData({ informationProvided: val })}
            error={errors.informationProvided}
          />
          <RatingCardGroup
            label="Cleanliness & Organization"
            value={data.cleanlinessOrganization as RatingValue}
            onChange={(val) => updateData({ cleanlinessOrganization: val })}
            error={errors.cleanlinessOrganization}
          />
          <RatingCardGroup
            label="Interaction with Staff"
            value={data.interactionWithStaff as RatingValue}
            onChange={(val) => updateData({ interactionWithStaff: val })}
            error={errors.interactionWithStaff}
          />
          <RatingCardGroup
            label="Safety Measures"
            value={data.safetyMeasures as RatingValue}
            onChange={(val) => updateData({ safetyMeasures: val })}
            error={errors.safetyMeasures}
          />
        </div>
      </div>
    </div>
  );
};

