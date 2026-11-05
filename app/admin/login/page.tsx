'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, User, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { BackgroundDecoration } from '@/components/BackgroundDecoration';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-br from-white via-pink-50/40 to-rose-100/50 relative overflow-hidden">
      <BackgroundDecoration />
      <div className="w-full max-w-md relative z-10">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-dxn-900 via-royal-pink to-pink-500 flex items-center justify-center shadow-soft text-white font-serif font-black text-2xl mb-3">
            D
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">DXN RESORT</h1>
          <p className="text-xs uppercase tracking-widest text-royal-pink font-semibold mt-0.5">
            Executive Admin Management Portal
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-card">
          <div className="flex items-center gap-2 mb-6 pb-3 border-b border-pink-50">
            <ShieldCheck className="w-5 h-5 text-royal-pink" />
            <h2 className="text-base font-bold text-slate-800">Secure Administrative Sign In</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-royal-pink focus:ring-2 focus:ring-royal-pink/15"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-royal-pink focus:ring-2 focus:ring-royal-pink/15"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-royal-pink to-rose-600 text-white font-bold text-sm hover:from-royal-pinkHover hover:to-rose-700 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <span>{loading ? 'Authenticating...' : 'Access Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-400">
              Default credentials in .env: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">admin</code> / <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">DXN_Resort@Admin2026</code>
            </span>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-royal-pink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Guest Feedback Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

