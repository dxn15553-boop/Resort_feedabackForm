import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FeedbackStepper } from '@/components/FeedbackStepper';
import { BackgroundDecoration } from '@/components/BackgroundDecoration';
import { Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-rose-50/40 via-white to-pink-50/50 relative">
      <BackgroundDecoration />
      <Header />

      {/* Luxury Hero Banner with Soft Pink Ambient Glow */}
      <section className="relative w-full pt-8 pb-4 sm:pt-12 sm:pb-6 px-4 sm:px-6 text-center">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-gradient-to-b from-pink-200/40 via-rose-100/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-white text-royal-pink border border-pink-200/80 mb-3.5 shadow-soft">
            <Sparkles className="w-3.5 h-3.5 text-royal-pink" />
            <span>Welcome to DXN Resort Experience</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 tracking-tight leading-tight sm:leading-tight">
            Guest Feedback & Quality Review
          </h1>

          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
            Your comfort, culinary dining, and wellness satisfaction are our highest priorities. Please take a few moments to share your valuable impressions across our six hospitality touchpoints.
          </p>
        </div>
      </section>

      {/* Main Feedback Form Canvas */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-6 pb-12 sm:pb-16">
        <FeedbackStepper />
      </main>

      <Footer />
    </div>
  );
}
