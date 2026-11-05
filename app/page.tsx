import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FeedbackStepper } from '@/components/FeedbackStepper';
import { BackgroundDecoration } from '@/components/BackgroundDecoration';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <BackgroundDecoration />
      <Header />

      {/* Clean, Simple Modern Header */}
      <section className="relative w-full pt-6 pb-2 sm:pt-8 sm:pb-4 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
            Guest Feedback
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium">
            We value your stay experience. Please share your feedback below.
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
