import { NextRequest, NextResponse } from 'next/server';
import { saveFeedbackRecord } from '@/lib/db';
import { FeedbackFormData } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body: FeedbackFormData = await req.json();

    // Mandatory Field Validations on Server
    const missing: string[] = [];

    // Step 1
    if (!body.fullName?.trim()) missing.push('Full Name');
    if (!body.roomNumber?.trim()) missing.push('Room Number');
    if (!body.visitDate) missing.push('Visit Date');
    if (!body.purposeOfVisit) missing.push('Purpose of Visit');
    if (!body.overallImpression) missing.push('Overall Impression');

    // Step 2
    if (!body.checkInProcess) missing.push('Check-in Process');
    if (!body.checkOutProcess) missing.push('Check-out Process');
    if (!body.staffFriendliness) missing.push('Staff Friendliness');
    if (!body.responseToRequests) missing.push('Response to Requests');
    if (!body.roomCleanliness) missing.push('Room Cleanliness');
    if (!body.comfortAmenities) missing.push('Comfort & Amenities');
    if (!body.housekeepingService) missing.push('Housekeeping Service');

    // Step 3
    if (!body.foodQuality) missing.push('Food Quality');
    if (!body.roomService) missing.push('Room Service');
    if (!body.factoryVisited) missing.push('Factory Visit Identification');

    // Step 4 (Conditional)
    if (body.factoryVisited === 'Yes, Visited') {
      if (!body.guidedTourExperience) missing.push('Guided Tour Experience');
      if (!body.informationProvided) missing.push('Information Provided');
      if (!body.cleanlinessOrganization) missing.push('Cleanliness & Organization');
      if (!body.interactionWithStaff) missing.push('Interaction with Staff');
      if (!body.safetyMeasures) missing.push('Safety Measures');
    }

    // Step 5
    if (!body.staffProfessionalism) missing.push('Staff Professionalism');
    if (!body.emergencyPreparedness) missing.push('Emergency Preparedness');
    if (!body.safetyCompliance) missing.push('Safety Compliance');
    if (!body.productBiscuits) missing.push('Biscuits');
    if (!body.productKombucha) missing.push('Kombucha');
    if (!body.productToothpaste) missing.push('Toothpaste');
    if (!body.productSoap) missing.push('Soap');
    if (!body.productShampoo) missing.push('Shampoo');
    if (!body.productCoffee) missing.push('Coffee');
    if (!body.productHandWash) missing.push('Hand Wash');

    // Step 6
    if (!body.refinementText?.trim()) missing.push('Suggestions & Refinements');
    if (!body.ambassadorStatus) missing.push('Ambassador Status');

    if (missing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing mandatory fields: ${missing.slice(0, 5).join(', ')}${
            missing.length > 5 ? ` and ${missing.length - 5} more` : ''
          }`,
        },
        { status: 400 }
      );
    }

    // Attempt save directly to PostgreSQL database
    const result = await saveFeedbackRecord(body);

    return NextResponse.json({
      success: true,
      feedbackId: result.feedbackId,
      source: result.source,
      message: 'Feedback verified and saved to database.',
    });
  } catch (err: any) {
    console.error('Server error handling feedback submission:', err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Database save error: Your submission could NOT be saved. Please retry.',
      },
      { status: 500 }
    );
  }
}

