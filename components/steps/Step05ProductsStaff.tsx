'use client';

import React from 'react';
import { FeedbackFormData, RatingValue } from '@/lib/types';
import { RatingCardGroup } from '../RatingCardGroup';
import { CompactProductMatrix } from '../CompactProductMatrix';
import { ShieldCheck, Package } from 'lucide-react';

interface Step05Props {
  data: FeedbackFormData;
  updateData: (fields: Partial<FeedbackFormData>) => void;
  errors: Record<string, string>;
}

export const Step05ProductsStaff: React.FC<Step05Props> = ({ data, updateData, errors }) => {
  const handleRateAllProducts = (val: RatingValue) => {
    updateData({
      productBiscuits: val,
      productKombucha: val,
      productToothpaste: val,
      productSoap: val,
      productShampoo: val,
      productCoffee: val,
      productHandWash: val,
    });
  };

  const productList = [
    {
      id: 'biscuits',
      name: 'Biscuits',
      category: 'DXN F&B',
      value: data.productBiscuits,
      onChange: (val: RatingValue) => updateData({ productBiscuits: val }),
      error: errors.productBiscuits,
    },
    {
      id: 'kombucha',
      name: 'Kombucha',
      category: 'DXN Beverage',
      value: data.productKombucha,
      onChange: (val: RatingValue) => updateData({ productKombucha: val }),
      error: errors.productKombucha,
    },
    {
      id: 'toothpaste',
      name: 'Toothpaste',
      category: 'Personal Care',
      value: data.productToothpaste,
      onChange: (val: RatingValue) => updateData({ productToothpaste: val }),
      error: errors.productToothpaste,
    },
    {
      id: 'soap',
      name: 'Soap',
      category: 'Personal Care',
      value: data.productSoap,
      onChange: (val: RatingValue) => updateData({ productSoap: val }),
      error: errors.productSoap,
    },
    {
      id: 'shampoo',
      name: 'Shampoo',
      category: 'Personal Care',
      value: data.productShampoo,
      onChange: (val: RatingValue) => updateData({ productShampoo: val }),
      error: errors.productShampoo,
    },
    {
      id: 'coffee',
      name: 'Coffee',
      category: 'DXN Beverage',
      value: data.productCoffee,
      onChange: (val: RatingValue) => updateData({ productCoffee: val }),
      error: errors.productCoffee,
    },
    {
      id: 'handwash',
      name: 'Hand Wash',
      category: 'Personal Care',
      value: data.productHandWash,
      onChange: (val: RatingValue) => updateData({ productHandWash: val }),
      error: errors.productHandWash,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Intro section */}
      <div className="border-b border-pink-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
          STEP 05 – Products & Staff
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Please assess our resort personnel standards and your experience with DXN signature wellness products.
        </p>
      </div>

      {/* Personnel & Safety */}
      <div className="bg-slate-50/50 rounded-2xl p-4 sm:p-5 border border-pink-100/60">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-pink-100/60">
          <div className="w-7 h-7 rounded-lg bg-pink-100 text-royal-pink flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Personnel & Safety</h3>
            <p className="text-xs text-slate-500">Security standards, protocol execution, and team professionalism</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <RatingCardGroup
            label="Staff Professionalism"
            value={data.staffProfessionalism as RatingValue}
            onChange={(val) => updateData({ staffProfessionalism: val })}
            error={errors.staffProfessionalism}
          />
          <RatingCardGroup
            label="Emergency Preparedness"
            value={data.emergencyPreparedness as RatingValue}
            onChange={(val) => updateData({ emergencyPreparedness: val })}
            error={errors.emergencyPreparedness}
          />
          <RatingCardGroup
            label="Safety Compliance"
            value={data.safetyCompliance as RatingValue}
            onChange={(val) => updateData({ safetyCompliance: val })}
            error={errors.safetyCompliance}
          />
        </div>
      </div>

      {/* Product Usage - Compact & Streamlined */}
      <div className="bg-slate-50/50 rounded-2xl p-4 sm:p-5 border border-pink-100/60">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-pink-100/60">
          <div className="w-7 h-7 rounded-lg bg-pink-100 text-royal-pink flex items-center justify-center">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Product Usage</h3>
            <p className="text-xs text-slate-500">
              DXN wellness and personal care products provided during your stay
            </p>
          </div>
        </div>

        {/* Compact Product Matrix */}
        <CompactProductMatrix
          products={productList}
          onRateAll={handleRateAllProducts}
        />
      </div>
    </div>
  );
};
