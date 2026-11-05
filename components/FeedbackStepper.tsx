'use client';

import React, { useState, useEffect } from 'react';
import { FeedbackFormData, INITIAL_FORM_DATA } from '@/lib/types';
import { generateSubmissionToken } from '@/lib/id';
import { ProgressBar } from './ProgressBar';
import { Step01GuestInfo } from './steps/Step01GuestInfo';
import { Step02HospitalityRooms } from './steps/Step02HospitalityRooms';
import { Step03CateringFactory } from './steps/Step03CateringFactory';
import { Step04IndustrialExperience } from './steps/Step04IndustrialExperience';
import { Step05ProductsStaff } from './steps/Step05ProductsStaff';
import { Step06FinalSummary } from './steps/Step06FinalSummary';
import { SuccessModal } from './SuccessModal';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';

const DRAFT_STORAGE_KEY = 'dxn_guest_feedback_draft_v1';

const STEP_TITLES = [
  { number: 1, label: 'Guest Info' },
  { number: 2, label: 'Hospitality & Rooms' },
  { number: 3, label: 'Catering & Factory' },
  { number: 4, label: 'Industrial Exp.' },
  { number: 5, label: 'Products & Staff' },
  { number: 6, label: 'Final Summary' },
];

export const FeedbackStepper: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FeedbackFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedFeedbackId, setConfirmedFeedbackId] = useState<string | null>(null);

  // Restore draft from localStorage on initial client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setFormData((prev) => ({
            ...prev,
            ...parsed,
            clientSubmissionToken: prev.clientSubmissionToken || parsed.clientSubmissionToken || generateSubmissionToken(),
          }));
        }
      } else {
        setFormData((prev) => ({ ...prev, clientSubmissionToken: generateSubmissionToken() }));
      }
    } catch {
      setFormData((prev) => ({ ...prev, clientSubmissionToken: generateSubmissionToken() }));
    }
  }, []);

  // Save draft on every change
  useEffect(() => {
    if (!confirmedFeedbackId) {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
      } catch (err) {
        console.warn('Unable to persist draft to localStorage:', err);
      }
    }
  }, [formData, confirmedFeedbackId]);

  const updateFormData = (fields: Partial<FeedbackFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    // Clear field-level errors on change
    if (Object.keys(errors).length > 0) {
      const nextErrors = { ...errors };
      for (const key of Object.keys(fields)) {
        delete nextErrors[key];
      }
      setErrors(nextErrors);
    }
  };

  // Validate the current step fields
  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
      if (!formData.roomNumber.trim()) errs.roomNumber = 'Room Number is required';
      if (!formData.visitDate) errs.visitDate = 'Visit Date is required';
      if (!formData.purposeOfVisit) errs.purposeOfVisit = 'Please select your Purpose of Visit';
      if (!formData.overallImpression) errs.overallImpression = 'Please select your Overall Impression rating';
    } else if (step === 2) {
      // Guest Services
      if (!formData.checkInProcess) errs.checkInProcess = 'Please rate the Check-in Process';
      if (!formData.checkOutProcess) errs.checkOutProcess = 'Please rate the Check-out Process';
      if (!formData.staffFriendliness) errs.staffFriendliness = 'Please rate Staff Friendliness';
      if (!formData.responseToRequests) errs.responseToRequests = 'Please rate Response to Requests';
      // Room Maintenance
      if (!formData.roomCleanliness) errs.roomCleanliness = 'Please rate Room Cleanliness';
      if (!formData.comfortAmenities) errs.comfortAmenities = 'Please rate Comfort & Amenities';
      if (!formData.housekeepingService) errs.housekeepingService = 'Please rate Housekeeping Service';
    } else if (step === 3) {
      // F&B Performance
      if (!formData.foodQuality) errs.foodQuality = 'Please rate Food Quality';
      if (!formData.roomService) errs.roomService = 'Please rate Room Service';
      // Factory Visit Identification
      if (!formData.factoryVisited) errs.factoryVisited = 'Please specify if you participated in factory tours';
    } else if (step === 4) {
      // Factory Metrics (only if visited)
      if (formData.factoryVisited === 'Yes, Visited') {
        if (!formData.guidedTourExperience) errs.guidedTourExperience = 'Please rate Guided Tour Experience';
        if (!formData.informationProvided) errs.informationProvided = 'Please rate Information Provided';
        if (!formData.cleanlinessOrganization) errs.cleanlinessOrganization = 'Please rate Cleanliness & Organization';
        if (!formData.interactionWithStaff) errs.interactionWithStaff = 'Please rate Interaction with Staff';
        if (!formData.safetyMeasures) errs.safetyMeasures = 'Please rate Safety Measures';
      }
    } else if (step === 5) {
      // Personnel & Safety
      if (!formData.staffProfessionalism) errs.staffProfessionalism = 'Please rate Staff Professionalism';
      if (!formData.emergencyPreparedness) errs.emergencyPreparedness = 'Please rate Emergency Preparedness';
      if (!formData.safetyCompliance) errs.safetyCompliance = 'Please rate Safety Compliance';
      // Product Usage
      if (!formData.productBiscuits) errs.productBiscuits = 'Please rate Biscuits';
      if (!formData.productKombucha) errs.productKombucha = 'Please rate Kombucha';
      if (!formData.productToothpaste) errs.productToothpaste = 'Please rate Toothpaste';
      if (!formData.productSoap) errs.productSoap = 'Please rate Soap';
      if (!formData.productShampoo) errs.productShampoo = 'Please rate Shampoo';
      if (!formData.productCoffee) errs.productCoffee = 'Please rate Coffee';
      if (!formData.productHandWash) errs.productHandWash = 'Please rate Hand Wash';
    } else if (step === 6) {
      // Refinement suggestions (Mandatory)
      if (!formData.refinementText || !formData.refinementText.trim()) {
        errs.refinementText = 'Please share at least a word or suggestion to refine your experience';
      }
      // Ambassador Status
      if (!formData.ambassadorStatus) {
        errs.ambassadorStatus = 'Please select whether you would recommend DXN Resort';
      }
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (!validateStep(currentStep)) return;

    // Handle conditional Step 04 skip
    if (currentStep === 3 && formData.factoryVisited === 'No, Skip') {
      setCurrentStep(5); // Jump past Step 04 directly to Step 05
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  const handleBack = () => {
    // Handle conditional Step 04 skip on backward navigation
    if (currentStep === 5 && formData.factoryVisited === 'No, Skip') {
      setCurrentStep(3); // Jump back from Step 05 to Step 03
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(6)) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Server rejected the submission. Please retry.');
      }

      // Success confirmed by database
      setConfirmedFeedbackId(result.feedbackId);
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {}
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitError(
        err.message || 'Unable to store your feedback due to a connection interruption. Your answers are saved locally. Please click Retry Submission.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setConfirmedFeedbackId(null);
    setCurrentStep(1);
    setFormData({
      ...INITIAL_FORM_DATA,
      clientSubmissionToken: generateSubmissionToken(),
    });
    setErrors({});
    setSubmitError(null);
  };

  if (confirmedFeedbackId) {
    return (
      <SuccessModal
        feedbackId={confirmedFeedbackId}
        guestName={formData.fullName}
        roomNumber={formData.roomNumber}
        onReset={handleResetForm}
      />
    );
  }

  return (
    <div className="w-full">
      {/* Main Unified Luxury Card */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border border-pink-100 shadow-card relative overflow-hidden">
          {/* Subtle Royal Pink Ribbon Accent at top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-rose-500 to-royal-pink" />

          {/* Integrated Progress Indicator at the top of the card */}
          <ProgressBar
            currentStep={currentStep}
            totalSteps={6}
            stepTitles={STEP_TITLES}
          />

          {/* Form Content Steps */}
          {currentStep === 1 && (
            <Step01GuestInfo data={formData} updateData={updateFormData} errors={errors} />
          )}
          {currentStep === 2 && (
            <Step02HospitalityRooms data={formData} updateData={updateFormData} errors={errors} />
          )}
          {currentStep === 3 && (
            <Step03CateringFactory data={formData} updateData={updateFormData} errors={errors} />
          )}
          {currentStep === 4 && (
            <Step04IndustrialExperience data={formData} updateData={updateFormData} errors={errors} />
          )}
          {currentStep === 5 && (
            <Step05ProductsStaff data={formData} updateData={updateFormData} errors={errors} />
          )}
          {currentStep === 6 && (
            <Step06FinalSummary data={formData} updateData={updateFormData} errors={errors} />
          )}

          {/* Error Banner when database save fails */}
          {submitError && (
            <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold">Submission Encountered an Issue</p>
                <p className="text-xs text-rose-700 mt-0.5">{submitError}</p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>Retry Submission</span>
                </button>
              </div>
            </div>
          )}

          {/* Navigation Controls: Back & Continue/Submit Buttons */}
          <div className="mt-8 pt-6 border-t border-pink-100/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            {/* Back Button */}
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div className="hidden sm:block" />
            )}

            {/* Right Side: Continue or Final Submit */}
            <div className="w-full sm:w-auto flex items-center gap-3">
              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-royal-pink to-rose-600 text-white font-semibold text-sm hover:from-royal-pinkHover hover:to-rose-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-bold text-sm hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving Securely to Database...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Submit Feedback</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

