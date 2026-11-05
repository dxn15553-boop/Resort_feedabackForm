export type RatingValue = 'Excellent' | 'Good' | 'Average' | 'Poor';

export type PurposeOfVisit =
  | 'Family Leisure'
  | 'Corporate Business'
  | 'Factory Inspection'
  | 'Other Reasons';

export type OverallImpression = 'Excellent' | 'Good' | 'Average' | 'Poor';

export type FactoryVisitedOption = 'Yes, Visited' | 'No, Skip';

export type AmbassadorStatus = 'Absolutely' | 'Not Likely';

export interface FeedbackFormData {
  // STEP 01 – Guest Information
  fullName: string;
  roomNumber: string;
  visitDate: string;
  purposeOfVisit: PurposeOfVisit | '';
  overallImpression: OverallImpression | '';

  // STEP 02 – Hospitality & Rooms
  // Guest Services
  checkInProcess: RatingValue | '';
  checkOutProcess: RatingValue | '';
  staffFriendliness: RatingValue | '';
  responseToRequests: RatingValue | '';
  // Room Maintenance
  roomCleanliness: RatingValue | '';
  comfortAmenities: RatingValue | '';
  housekeepingService: RatingValue | '';

  // STEP 03 – Catering & Factory
  // F&B Performance
  foodQuality: RatingValue | '';
  roomService: RatingValue | '';
  // Factory Visit Identification
  factoryVisited: FactoryVisitedOption | '';

  // STEP 04 – Industrial Experience (conditional)
  guidedTourExperience?: RatingValue | '';
  informationProvided?: RatingValue | '';
  cleanlinessOrganization?: RatingValue | '';
  interactionWithStaff?: RatingValue | '';
  safetyMeasures?: RatingValue | '';

  // STEP 05 – Products & Staff
  // Personnel & Safety
  staffProfessionalism: RatingValue | '';
  emergencyPreparedness: RatingValue | '';
  safetyCompliance: RatingValue | '';
  // Product Usage
  productBiscuits: RatingValue | '';
  productKombucha: RatingValue | '';
  productToothpaste: RatingValue | '';
  productSoap: RatingValue | '';
  productShampoo: RatingValue | '';
  productCoffee: RatingValue | '';
  productHandWash: RatingValue | '';

  // STEP 06 – Final Summary
  refinementText: string;
  ambassadorStatus: AmbassadorStatus | '';

  // Submission metadata
  clientSubmissionToken?: string;
}

export interface StoredFeedback extends FeedbackFormData {
  id: string;
  feedbackId: string;
  createdAt: string;
  updatedAt?: string;
}

export const INITIAL_FORM_DATA: FeedbackFormData = {
  fullName: '',
  roomNumber: '',
  visitDate: '',
  purposeOfVisit: '',
  overallImpression: '',

  checkInProcess: '',
  checkOutProcess: '',
  staffFriendliness: '',
  responseToRequests: '',
  roomCleanliness: '',
  comfortAmenities: '',
  housekeepingService: '',

  foodQuality: '',
  roomService: '',
  factoryVisited: '',

  guidedTourExperience: '',
  informationProvided: '',
  cleanlinessOrganization: '',
  interactionWithStaff: '',
  safetyMeasures: '',

  staffProfessionalism: '',
  emergencyPreparedness: '',
  safetyCompliance: '',

  productBiscuits: '',
  productKombucha: '',
  productToothpaste: '',
  productSoap: '',
  productShampoo: '',
  productCoffee: '',
  productHandWash: '',

  refinementText: '',
  ambassadorStatus: '',
};

