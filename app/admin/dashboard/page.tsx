'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StoredFeedback, RatingValue } from '@/lib/types';
import * as XLSX from 'xlsx';
import {
  LogOut,
  Download,
  Search,
  Star,
  Users,
  Building,
  Factory,
  ThumbsUp,
  MessageSquare,
  Package,
  Calendar,
  X,
  RefreshCw,
  ExternalLink,
  Database,
  CheckCircle,
  Eye,
  BarChart3,
  ListFilter,
  Check,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'records' | 'overview' | 'products' | 'factory' | 'suggestions'>('records');

  const [data, setData] = useState<{
    totalSubmissions: number;
    impressionCounts: Record<RatingValue, number>;
    globalRatingCounts: Record<RatingValue, number>;
    categoryAverages: {
      hospitality: string;
      catering: string;
      industrial: string;
      personnel: string;
      products: string;
    };
    productStats: Record<string, { Excellent: number; Good: number; Average: number; Poor: number; avgScore: number }>;
    recommendationStats: { Absolutely: number; NotLikely: number; total: number };
    factoryVisitStats: { visited: number; skipped: number };
    records: StoredFeedback[];
  } | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterImpression, setFilterImpression] = useState('');
  const [factoryFilter, setFactoryFilter] = useState<'all' | 'visited' | 'skipped'>('all');

  // Modal for Viewing Individual Feedback
  const [selectedRecord, setSelectedRecord] = useState<StoredFeedback | null>(null);

  // Backup state
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setFetchError(null);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch('/api/admin/feedback', {
        signal: controller.signal,
        cache: 'no-store',
      });
      clearTimeout(timeoutId);

      if (res.status === 401) {
        window.location.replace('/admin/login');
        return;
      }
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      } else {
        setFetchError(json.error || 'Failed to load dashboard data');
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('Failed to load dashboard data:', err);
      if (err.name === 'AbortError') {
        setFetchError('Request timed out while connecting to database. Please click Retry.');
      } else {
        setFetchError(err.message || 'Network error connecting to dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleRunBackup = async () => {
    setBackupLoading(true);
    setBackupStatus(null);
    try {
      const res = await fetch('/api/cron/backup');
      const json = await res.json();
      if (json.success) {
        setBackupStatus(`Database export completed: ${json.filename} (${json.recordsCount} records stored).`);
      } else {
        setBackupStatus(`Backup failed: ${json.error}`);
      }
    } catch (err: any) {
      setBackupStatus(`Backup request failed: ${err.message}`);
    } finally {
      setBackupLoading(false);
    }
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    if (!data?.records) return [];

    return data.records.filter((r) => {
      // Search by guest name, room number, or date or ID
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = r.fullName?.toLowerCase().includes(q);
        const matchesRoom = r.roomNumber?.toLowerCase().includes(q);
        const matchesDate = r.visitDate?.toLowerCase().includes(q);
        const matchesId = r.feedbackId?.toLowerCase().includes(q);
        if (!matchesName && !matchesRoom && !matchesDate && !matchesId) return false;
      }

      // Filter by visit date
      if (filterDate && r.visitDate !== filterDate) {
        return false;
      }

      // Filter by overall impression
      if (filterImpression && r.overallImpression !== filterImpression) {
        return false;
      }

      // Filter by factory visit
      if (factoryFilter === 'visited' && r.factoryVisited !== 'Yes, Visited') {
        return false;
      }
      if (factoryFilter === 'skipped' && r.factoryVisited !== 'No, Skip') {
        return false;
      }

      return true;
    });
  }, [data?.records, searchQuery, filterDate, filterImpression, factoryFilter]);

  // Export to Excel / CSV
  const exportData = (type: 'csv' | 'xlsx') => {
    if (!filteredRecords.length) return;

    const rows = filteredRecords.map((r) => ({
      'Feedback ID': r.feedbackId,
      'Submission Date': r.createdAt,
      'Full Name': r.fullName,
      'Room Number': r.roomNumber,
      'Visit Date': r.visitDate,
      'Length of Stay': r.lengthOfStay || 'N/A',
      'Purpose of Visit': r.purposeOfVisit,
      'Overall Impression': r.overallImpression,
      'Check-in Process': r.checkInProcess,
      'Check-out Process': r.checkOutProcess,
      'Staff Friendliness': r.staffFriendliness,
      'Response to Requests': r.responseToRequests,
      'Room Cleanliness': r.roomCleanliness,
      'Comfort & Amenities': r.comfortAmenities,
      'Housekeeping Service': r.housekeepingService,
      'Food Quality': r.foodQuality,
      'Room Service': r.roomService,
      'Factory Visited': r.factoryVisited,
      'Guided Tour Experience': r.guidedTourExperience || 'N/A',
      'Information Provided': r.informationProvided || 'N/A',
      'Cleanliness & Organization': r.cleanlinessOrganization || 'N/A',
      'Interaction with Staff': r.interactionWithStaff || 'N/A',
      'Safety Measures': r.safetyMeasures || 'N/A',
      'Staff Professionalism': r.staffProfessionalism,
      'Emergency Preparedness': r.emergencyPreparedness,
      'Safety Compliance': r.safetyCompliance,
      'Product - Biscuits': r.productBiscuits,
      'Product - Kombucha': r.productKombucha,
      'Product - Toothpaste': r.productToothpaste,
      'Product - Soap': r.productSoap,
      'Product - Shampoo': r.productShampoo,
      'Product - Coffee': r.productCoffee,
      'Product - Hand Wash': r.productHandWash,
      'Staff Compliments': r.staffCompliment || 'N/A',
      'Suggestions & Refinements': r.refinementText || '',
      'Recommend to Others': r.ambassadorStatus,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Guest Feedback');

    const fileName = `DXN_Resort_Feedback_${new Date().toISOString().slice(0, 10)}.${type}`;
    XLSX.writeFile(workbook, fileName, { bookType: type });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-royal-pink animate-spin" />
          <p className="text-sm font-semibold text-slate-700">Loading DXN Resort Analytics...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full text-center">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-1">Session Expired or Login Required</h2>
          <p className="text-xs text-slate-600 mb-5">
            {fetchError || 'Please log in with administrative credentials to access this dashboard.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              onClick={() => fetchDashboardData()}
              className="w-full sm:w-auto px-4 py-2 bg-royal-pink text-white text-xs font-semibold rounded-lg hover:bg-royal-pinkHover transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => { window.location.href = '/admin/login'; }}
              className="w-full sm:w-auto px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition-colors"
            >
              Sign In to Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  const recRate = data?.recommendationStats?.total
    ? Math.round(((data.recommendationStats.Absolutely || 0) / data.recommendationStats.total) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Executive Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                  Feedback Form
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-pink-100 text-royal-pink">
                  ADMIN PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Guest Submissions & Analytics</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-royal-pink bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:border-pink-300 transition-colors shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Guest Portal</span>
            </Link>

            <button
              type="button"
              onClick={handleRunBackup}
              disabled={backupLoading}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors shadow-2xs"
              title="Trigger instant database backup export"
            >
              <Database className={`w-3.5 h-3.5 ${backupLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Backup Database</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 transition-colors shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 flex items-center gap-1 sm:gap-2 overflow-x-auto py-2">
          <button
            type="button"
            onClick={() => setActiveTab('records')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'records'
                ? 'bg-royal-pink text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Guest Records ({data?.records?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-royal-pink text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>KPI Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-royal-pink text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Product Ratings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('factory')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'factory'
                ? 'bg-royal-pink text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span>Factory Tours ({data?.factoryVisitStats?.visited || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('suggestions')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'suggestions'
                ? 'bg-royal-pink text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Guest Suggestions</span>
          </button>
        </div>
      </header>

      {/* Backup Notification Banner */}
      {backupStatus && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{backupStatus}</span>
            </div>
            <button onClick={() => setBackupStatus(null)} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Dashboard Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* TAB 1: GUEST RECORDS TABLE */}
        {activeTab === 'records' && (
          <div className="space-y-4">
            {/* Search & Action Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by guest name, room number, date, or ID..."
                  className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-royal-pink bg-white"
                />
              </div>

              {/* Filters & Export Group */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Date Filter */}
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-royal-pink bg-white"
                  title="Filter by Visit Date"
                />

                {/* Impression Filter */}
                <select
                  value={filterImpression}
                  onChange={(e) => setFilterImpression(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-royal-pink bg-white"
                >
                  <option value="">All Impressions</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                  <option value="Poor">Poor</option>
                </select>

                {/* Factory Segments Filter */}
                <select
                  value={factoryFilter}
                  onChange={(e) => setFactoryFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-royal-pink bg-white"
                >
                  <option value="all">All Itineraries</option>
                  <option value="visited">Factory Visited</option>
                  <option value="skipped">Factory Skipped</option>
                </select>

                {/* Reset Filters */}
                {(searchQuery || filterDate || filterImpression || factoryFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterDate('');
                      setFilterImpression('');
                      setFactoryFilter('all');
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-semibold transition-colors"
                  >
                    Reset
                  </button>
                )}

                {/* Excel & CSV Export Buttons */}
                <div className="flex items-center gap-1.5 ml-auto md:ml-2">
                  <button
                    type="button"
                    onClick={() => exportData('xlsx')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Excel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => exportData('csv')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900 transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Records Data Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Guest Feedback Submissions</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Displaying {filteredRecords.length} of {data?.records.length || 0} permanent database records
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Feedback ID</th>
                      <th className="py-3.5 px-4">Guest Name</th>
                      <th className="py-3.5 px-4">Room</th>
                      <th className="py-3.5 px-4">Visit Date</th>
                      <th className="py-3.5 px-4">Purpose</th>
                      <th className="py-3.5 px-4">Impression</th>
                      <th className="py-3.5 px-4">Factory</th>
                      <th className="py-3.5 px-4">Recommend</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-400">
                          No feedback submissions found matching the criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((r) => (
                        <tr key={r.id || r.feedbackId} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-royal-pink">{r.feedbackId}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{r.fullName}</td>
                          <td className="py-3.5 px-4 font-medium">{r.roomNumber}</td>
                          <td className="py-3.5 px-4">{r.visitDate}</td>
                          <td className="py-3.5 px-4 truncate max-w-[140px] text-slate-600">{r.purposeOfVisit}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                r.overallImpression === 'Excellent'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : r.overallImpression === 'Good'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : r.overallImpression === 'Average'
                                  ? 'bg-sky-50 text-sky-800 border border-sky-200'
                                  : 'bg-rose-50 text-rose-800 border border-rose-200'
                              }`}
                            >
                              {r.overallImpression}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                r.factoryVisited === 'Yes, Visited'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {r.factoryVisited === 'Yes, Visited' ? 'Visited' : 'Skipped'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[11px] font-bold ${
                                r.ambassadorStatus === 'Absolutely' ? 'text-emerald-700' : 'text-slate-500'
                              }`}
                            >
                              {r.ambassadorStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedRecord(r)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink-50 text-royal-pink hover:bg-pink-100 font-semibold text-xs transition-colors border border-pink-200"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Full</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OVERVIEW & KPIS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Total Submissions</span>
                  <div className="w-8 h-8 rounded-lg bg-pink-100 text-royal-pink flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-black text-slate-900">{data?.totalSubmissions || 0}</span>
                  <span className="text-xs text-emerald-600 font-semibold">Active Records</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Impressions Breakdown</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Star className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-1 text-center">
                  <div>
                    <div className="text-lg font-bold text-slate-900">{data?.impressionCounts.Excellent || 0}</div>
                    <div className="text-[10px] text-amber-600 font-semibold">Excell.</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900">{data?.impressionCounts.Good || 0}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">Good</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900">{data?.impressionCounts.Average || 0}</div>
                    <div className="text-[10px] text-sky-600 font-semibold">Avg.</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900">{data?.impressionCounts.Poor || 0}</div>
                    <div className="text-[10px] text-rose-600 font-semibold">Poor</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Ambassador Rate</span>
                  <div className="w-8 h-8 rounded-lg bg-rose-100 text-royal-pink flex items-center justify-center">
                    <ThumbsUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-black text-royal-pink">{recRate}%</span>
                  <span className="text-xs text-slate-500">
                    {data?.recommendationStats.Absolutely || 0} / {data?.recommendationStats.total || 0} guests
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>Factory Visitors</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Factory className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-black text-slate-900">{data?.factoryVisitStats.visited || 0}</span>
                  <span className="text-xs text-slate-500">({data?.factoryVisitStats.skipped || 0} skipped)</span>
                </div>
              </div>
            </div>

            {/* Category Scores */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Building className="w-4 h-4 text-royal-pink" />
                <span>Category Performance Ratings (Scale 1.00 – 4.00)</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <span className="text-xs text-slate-500 font-medium block">Hospitality & Rooms</span>
                  <span className="text-2xl font-bold text-slate-900 mt-1 block">
                    {data?.categoryAverages.hospitality || '0.00'}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <span className="text-xs text-slate-500 font-medium block">Catering (F&B)</span>
                  <span className="text-2xl font-bold text-slate-900 mt-1 block">
                    {data?.categoryAverages.catering || '0.00'}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <span className="text-xs text-slate-500 font-medium block">Industrial Tour</span>
                  <span className="text-2xl font-bold text-slate-900 mt-1 block">
                    {data?.categoryAverages.industrial || '0.00'}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <span className="text-xs text-slate-500 font-medium block">Personnel & Safety</span>
                  <span className="text-2xl font-bold text-slate-900 mt-1 block">
                    {data?.categoryAverages.personnel || '0.00'}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center col-span-2 sm:col-span-1">
                  <span className="text-xs text-slate-500 font-medium block">DXN Products</span>
                  <span className="text-2xl font-bold text-slate-900 mt-1 block">
                    {data?.categoryAverages.products || '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCT RATINGS */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100">
              <Package className="w-5 h-5 text-royal-pink" />
              <div>
                <h2 className="text-base font-bold text-slate-900">DXN Product Quality & Usage Analysis</h2>
                <p className="text-xs text-slate-500">Evaluations for amenities and wellness items provided in rooms and dining</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.productStats &&
                Object.entries(data.productStats).map(([prodName, stats]) => {
                  const total = stats.Excellent + stats.Good + stats.Average + stats.Poor;
                  const excPct = total > 0 ? Math.round((stats.Excellent / total) * 100) : 0;
                  const goodPct = total > 0 ? Math.round((stats.Good / total) * 100) : 0;

                  return (
                    <div key={prodName} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-slate-900">{prodName}</span>
                        <span className="text-xs font-bold text-royal-pink bg-pink-50 px-2 py-0.5 rounded border border-pink-100">
                          {stats.avgScore} / 4.00
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex mb-3">
                        <div style={{ width: `${excPct}%` }} className="bg-amber-500" title={`Excellent: ${excPct}%`} />
                        <div style={{ width: `${goodPct}%` }} className="bg-emerald-500" title={`Good: ${goodPct}%`} />
                      </div>

                      <div className="grid grid-cols-4 gap-1 text-center text-[11px] text-slate-600">
                        <div className="bg-white p-1.5 rounded border border-slate-100">
                          <span className="block font-bold text-amber-600">{stats.Excellent}</span>
                          <span className="text-[10px] text-slate-400">Exc</span>
                        </div>
                        <div className="bg-white p-1.5 rounded border border-slate-100">
                          <span className="block font-bold text-emerald-600">{stats.Good}</span>
                          <span className="text-[10px] text-slate-400">Good</span>
                        </div>
                        <div className="bg-white p-1.5 rounded border border-slate-100">
                          <span className="block font-bold text-sky-600">{stats.Average}</span>
                          <span className="text-[10px] text-slate-400">Avg</span>
                        </div>
                        <div className="bg-white p-1.5 rounded border border-slate-100">
                          <span className="block font-bold text-rose-600">{stats.Poor}</span>
                          <span className="text-[10px] text-slate-400">Poor</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 4: FACTORY TOURS */}
        {activeTab === 'factory' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <Factory className="w-5 h-5 text-purple-600" />
                <div>
                  <h2 className="text-base font-bold text-slate-900">Industrial Facility & Tour Analytics</h2>
                  <p className="text-xs text-slate-500">Evaluations from guests who toured or inspected the DXN manufacturing facility</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                  <span className="text-xs text-purple-700 font-semibold block">Total Factory Visitors</span>
                  <span className="text-2xl font-black text-purple-900 mt-1 block">
                    {data?.factoryVisitStats.visited || 0}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-600 font-semibold block">Skipped Industrial Tour</span>
                  <span className="text-2xl font-black text-slate-800 mt-1 block">
                    {data?.factoryVisitStats.skipped || 0}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs text-emerald-700 font-semibold block">Industrial Average Score</span>
                  <span className="text-2xl font-black text-emerald-900 mt-1 block">
                    {data?.categoryAverages.industrial || '0.00'} / 4.00
                  </span>
                </div>
              </div>

              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Factory Visitors Review Records:
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {data?.records
                  .filter((r) => r.factoryVisited === 'Yes, Visited')
                  .map((r) => (
                    <div key={r.id || r.feedbackId} className="p-3.5 hover:bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 mr-2">{r.fullName}</span>
                        <span className="text-slate-500 font-mono text-[11px] mr-2">({r.feedbackId})</span>
                        <span className="text-slate-400">Room {r.roomNumber} &bull; {r.visitDate}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(r)}
                        className="px-2.5 py-1 rounded bg-pink-50 text-royal-pink font-semibold hover:bg-pink-100"
                      >
                        Inspect
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: GUEST SUGGESTIONS STREAM */}
        {activeTab === 'suggestions' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <MessageSquare className="w-5 h-5 text-royal-pink" />
              <div>
                <h2 className="text-base font-bold text-slate-900">Guest Suggestions & Refinements Stream</h2>
                <p className="text-xs text-slate-500">Live feed of comments submitted in Step 06 to refine resort experiences</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data?.records
                .filter((r) => r.refinementText && r.refinementText.trim().length > 0)
                .map((r) => (
                  <div key={r.id || r.feedbackId} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{r.fullName}</span>
                        <span className="text-[11px] text-slate-500 font-medium">Room {r.roomNumber}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{r.visitDate}</span>
                    </div>
                    <p className="text-xs text-slate-800 italic leading-relaxed whitespace-pre-wrap bg-white p-3 rounded-lg border border-slate-200">
                      &ldquo;{r.refinementText}&rdquo;
                    </p>
                    {r.staffCompliment && (
                      <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-1.5 font-medium">
                        <span>★ Staff Compliment:</span>
                        <span className="font-semibold">{r.staffCompliment}</span>
                      </div>
                    )}
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Ambassador Status: <strong className="text-emerald-700">{r.ambassadorStatus}</strong></span>
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(r)}
                        className="text-royal-pink font-semibold hover:underline"
                      >
                        View Full Submission &rarr;
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal: View Complete Individual Feedback */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-slate-200 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-royal-pink bg-pink-50 px-2 py-0.5 rounded border border-pink-100">
                    {selectedRecord.feedbackId}
                  </span>
                  <span className="text-xs text-slate-400">
                    Submitted: {new Date(selectedRecord.createdAt).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-900 mt-1">
                  Complete Guest Feedback Record
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: All 6 Steps */}
            <div className="space-y-4 mt-6 text-xs text-slate-700">
              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
                  Step 01 – Guest Information
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-slate-400 block">Full Name:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Room Number:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.roomNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Visit Date:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.visitDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Overall Impression:</span>
                    <span className="font-bold text-royal-pink">{selectedRecord.overallImpression}</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-slate-400">Purpose of Visit: </span>
                    <span className="font-semibold text-slate-800">{selectedRecord.purposeOfVisit}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Length of Stay: </span>
                    <span className="font-semibold text-slate-800">{selectedRecord.lengthOfStay || '1 - 2 Nights'}</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
                  Step 02 – Hospitality & Rooms
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-slate-400 block">Check-in Process:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.checkInProcess}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Check-out Process:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.checkOutProcess}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Staff Friendliness:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.staffFriendliness}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Response to Requests:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.responseToRequests}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Room Cleanliness:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.roomCleanliness}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Comfort & Amenities:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.comfortAmenities}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Housekeeping Service:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.housekeepingService}</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
                  Step 03 – Catering & Factory
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block">Food Quality:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.foodQuality}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Room Service:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.roomService}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Factory Participation:</span>
                    <span className="font-bold text-purple-700">{selectedRecord.factoryVisited}</span>
                  </div>
                </div>
              </div>

              {/* Step 4 (if visited) */}
              {selectedRecord.factoryVisited === 'Yes, Visited' && (
                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200">
                  <h4 className="font-bold text-purple-900 uppercase tracking-wider text-[11px] mb-3">
                    Step 04 – Industrial Experience (Factory Visited)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-400 block">Guided Tour Experience:</span>
                      <span className="font-semibold text-slate-800">{selectedRecord.guidedTourExperience}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Information Provided:</span>
                      <span className="font-semibold text-slate-800">{selectedRecord.informationProvided}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Cleanliness & Organization:</span>
                      <span className="font-semibold text-slate-800">{selectedRecord.cleanlinessOrganization}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Interaction with Staff:</span>
                      <span className="font-semibold text-slate-800">{selectedRecord.interactionWithStaff}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Safety Measures:</span>
                      <span className="font-semibold text-slate-800">{selectedRecord.safetyMeasures}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
                  Step 05 – Products & Staff
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 block">Staff Professionalism:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.staffProfessionalism}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Emergency Preparedness:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.emergencyPreparedness}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Safety Compliance:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.safetyCompliance}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-slate-400 block">Biscuits:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.productBiscuits}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Kombucha:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.productKombucha}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Toothpaste:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.productToothpaste}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Soap:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.productSoap}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Shampoo:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.productShampoo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Coffee:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.productCoffee}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Hand Wash:</span>
                    <span className="font-semibold text-slate-800">{selectedRecord.productHandWash}</span>
                  </div>
                </div>
              </div>

              {/* Step 6 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
                  Step 06 – Final Summary & Ambassador Status
                </h4>
                <div className="mb-3">
                  <span className="text-slate-400 block mb-0.5">Refinement Suggestions:</span>
                  <p className="font-medium text-slate-800 italic bg-white p-3 rounded-lg border border-slate-200">
                    {selectedRecord.refinementText || '(No comments provided)'}
                  </p>
                </div>
                {selectedRecord.staffCompliment && (
                  <div className="mb-3">
                    <span className="text-slate-400 block mb-0.5">Staff Recognition / Compliments:</span>
                    <p className="font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                      ★ {selectedRecord.staffCompliment}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 block">Ambassador Status:</span>
                  <span className="font-bold text-emerald-700 text-sm">{selectedRecord.ambassadorStatus}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900 transition-colors shadow-xs"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
