'use client';

import React from 'react';
import { FeedbackFormData, RatingValue } from '@/lib/types';
import { RatingCardGroup } from '../RatingCardGroup';
import { ConciergeBell, BedDouble } from 'lucide-react';

interface Step02Props {
  data: FeedbackFormData;
  updateData: (fields: Partial<FeedbackFormData>) => void;
  errors: Record<string, string>;
}

export const Step02HospitalityRooms: React.FC<Step02Props> = ({ data, updateData, errors }) => {
  return (
    <div className="space-y-6">
      {/* Guest Services Sub-category */}
      <div className="bg-slate-50/50 rounded-2xl p-4 sm:p-5 border border-pink-100/60">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-pink-100/60">
          <div className="w-7 h-7 rounded-lg bg-pink-100 text-royal-pink flex items-center justify-center">
            <ConciergeBell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Guest Services</h3>
            <p className="text-xs text-slate-500">Front desk reception, staff interaction, and request fulfillment</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <RatingCardGroup
            label="Check-in Process"
            value={data.checkInProcess as RatingValue}
            onChange={(val) => updateData({ checkInProcess: val })}
            error={errors.checkInProcess}
          />
          <RatingCardGroup
            label="Check-out Process"
            value={data.checkOutProcess as RatingValue}
            onChange={(val) => updateData({ checkOutProcess: val })}
            error={errors.checkOutProcess}
          />
          <RatingCardGroup
            label="Staff Friendliness"
            value={data.staffFriendliness as RatingValue}
            onChange={(val) => updateData({ staffFriendliness: val })}
            error={errors.staffFriendliness}
          />
          <RatingCardGroup
            label="Response to Requests"
            value={data.responseToRequests as RatingValue}
            onChange={(val) => updateData({ responseToRequests: val })}
            error={errors.responseToRequests}
          />
        </div>
      </div>

      {/* Room Maintenance Sub-category */}
      <div className="bg-slate-50/50 rounded-2xl p-4 sm:p-5 border border-pink-100/60">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-pink-100/60">
          <div className="w-7 h-7 rounded-lg bg-pink-100 text-royal-pink flex items-center justify-center">
            <BedDouble className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Room Maintenance</h3>
            <p className="text-xs text-slate-500">Hygiene, cleanliness, bed comfort, amenities, and room care</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <RatingCardGroup
            label="Room Cleanliness"
            value={data.roomCleanliness as RatingValue}
            onChange={(val) => updateData({ roomCleanliness: val })}
            error={errors.roomCleanliness}
          />
          <RatingCardGroup
            label="Comfort & Amenities"
            value={data.comfortAmenities as RatingValue}
            onChange={(val) => updateData({ comfortAmenities: val })}
            error={errors.comfortAmenities}
          />
          <RatingCardGroup
            label="Housekeeping Service"
            value={data.housekeepingService as RatingValue}
            onChange={(val) => updateData({ housekeepingService: val })}
            error={errors.housekeepingService}
          />
        </div>
      </div>
    </div>
  );
};

