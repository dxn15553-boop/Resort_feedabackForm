import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { getAllFeedbackRecords } from '@/lib/db';
import { StoredFeedback, RatingValue } from '@/lib/types';

export const dynamic = 'force-dynamic';

const RATING_SCORE_MAP: Record<RatingValue, number> = {
  Excellent: 4,
  Good: 3,
  Average: 2,
  Poor: 1,
};

export async function GET(req: NextRequest) {
  // Validate Admin Session
  const isAuthenticated = await getAdminSession();
  if (!isAuthenticated) {
    return NextResponse.json({ success: false, error: 'Unauthorized admin access' }, { status: 401 });
  }

  try {
    const records: StoredFeedback[] = await getAllFeedbackRecords();

    // 1. Overall impression counts
    const impressionCounts = {
      Excellent: 0,
      Good: 0,
      Average: 0,
      Poor: 0,
    };

    // 2. Global rating counts across all rated questions
    const globalRatingCounts = {
      Excellent: 0,
      Good: 0,
      Average: 0,
      Poor: 0,
    };

    // Helper to count rating
    const countRating = (val?: string) => {
      if (!val) return;
      if (val in globalRatingCounts) {
        globalRatingCounts[val as RatingValue]++;
      }
    };

    // 3. Category scores
    const categoryTotals = {
      hospitality: { sum: 0, count: 0 },
      catering: { sum: 0, count: 0 },
      industrial: { sum: 0, count: 0 },
      personnel: { sum: 0, count: 0 },
      products: { sum: 0, count: 0 },
    };

    const addScore = (cat: keyof typeof categoryTotals, val?: string) => {
      if (!val || !(val in RATING_SCORE_MAP)) return;
      categoryTotals[cat].sum += RATING_SCORE_MAP[val as RatingValue];
      categoryTotals[cat].count++;
      countRating(val);
    };

    // 4. Product-wise rating aggregates
    const products = [
      'Biscuits',
      'Kombucha',
      'Toothpaste',
      'Soap',
      'Shampoo',
      'Coffee',
      'Hand Wash',
    ] as const;

    const productStats: Record<string, { Excellent: number; Good: number; Average: number; Poor: number; avgScore: number }> = {};
    for (const p of products) {
      productStats[p] = { Excellent: 0, Good: 0, Average: 0, Poor: 0, avgScore: 0 };
    }

    // 5. Ambassador recommendations
    const recommendationStats = {
      Absolutely: 0,
      NotLikely: 0,
      total: 0,
    };

    // 6. Factory Visit counts
    const factoryVisitStats = {
      visited: 0,
      skipped: 0,
    };

    // Process all submissions
    for (const r of records) {
      // Impression
      if (r.overallImpression && r.overallImpression in impressionCounts) {
        impressionCounts[r.overallImpression as RatingValue]++;
        countRating(r.overallImpression);
      }

      // Step 2 Hospitality
      addScore('hospitality', r.checkInProcess);
      addScore('hospitality', r.checkOutProcess);
      addScore('hospitality', r.staffFriendliness);
      addScore('hospitality', r.responseToRequests);
      addScore('hospitality', r.roomCleanliness);
      addScore('hospitality', r.comfortAmenities);
      addScore('hospitality', r.housekeepingService);

      // Step 3 Catering
      addScore('catering', r.foodQuality);
      addScore('catering', r.roomService);

      if (r.factoryVisited === 'Yes, Visited') {
        factoryVisitStats.visited++;
        // Step 4 Industrial
        addScore('industrial', r.guidedTourExperience);
        addScore('industrial', r.informationProvided);
        addScore('industrial', r.cleanlinessOrganization);
        addScore('industrial', r.interactionWithStaff);
        addScore('industrial', r.safetyMeasures);
      } else {
        factoryVisitStats.skipped++;
      }

      // Step 5 Personnel
      addScore('personnel', r.staffProfessionalism);
      addScore('personnel', r.emergencyPreparedness);
      addScore('personnel', r.safetyCompliance);

      // Step 5 Products
      const prodPairs: [string, string][] = [
        ['Biscuits', r.productBiscuits],
        ['Kombucha', r.productKombucha],
        ['Toothpaste', r.productToothpaste],
        ['Soap', r.productSoap],
        ['Shampoo', r.productShampoo],
        ['Coffee', r.productCoffee],
        ['Hand Wash', r.productHandWash],
      ];

      for (const [prodName, val] of prodPairs) {
        addScore('products', val);
        if (val && val in productStats[prodName]) {
          (productStats[prodName] as any)[val]++;
        }
      }

      // Step 6 Ambassador
      if (r.ambassadorStatus === 'Absolutely') {
        recommendationStats.Absolutely++;
        recommendationStats.total++;
      } else if (r.ambassadorStatus === 'Not Likely') {
        recommendationStats.NotLikely++;
        recommendationStats.total++;
      }
    }

    // Calculate category averages on scale of 1.0 - 4.0
    const categoryAverages = {
      hospitality: categoryTotals.hospitality.count > 0 ? (categoryTotals.hospitality.sum / categoryTotals.hospitality.count).toFixed(2) : '0.00',
      catering: categoryTotals.catering.count > 0 ? (categoryTotals.catering.sum / categoryTotals.catering.count).toFixed(2) : '0.00',
      industrial: categoryTotals.industrial.count > 0 ? (categoryTotals.industrial.sum / categoryTotals.industrial.count).toFixed(2) : '0.00',
      personnel: categoryTotals.personnel.count > 0 ? (categoryTotals.personnel.sum / categoryTotals.personnel.count).toFixed(2) : '0.00',
      products: categoryTotals.products.count > 0 ? (categoryTotals.products.sum / categoryTotals.products.count).toFixed(2) : '0.00',
    };

    // Calculate product averages
    for (const p of products) {
      const pData = productStats[p];
      const sum = pData.Excellent * 4 + pData.Good * 3 + pData.Average * 2 + pData.Poor * 1;
      const count = pData.Excellent + pData.Good + pData.Average + pData.Poor;
      pData.avgScore = count > 0 ? Number((sum / count).toFixed(2)) : 0;
    }

    return NextResponse.json({
      success: true,
      data: {
        totalSubmissions: records.length,
        impressionCounts,
        globalRatingCounts,
        categoryAverages,
        productStats,
        recommendationStats,
        factoryVisitStats,
        records,
      },
    });
  } catch (err: any) {
    console.error('Failed to load feedback admin records:', err);
    return NextResponse.json(
      { success: false, error: 'Database query failure' },
      { status: 500 }
    );
  }
}

