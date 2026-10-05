export interface Treatment {
  id: string;
  name: string;
  category: 'facials' | 'slimming' | 'enhancement' | 'laser' | 'wellness' | 'prior';
  categoryLabel: string;
  tagline?: string;
  description?: string;
  priceFormatted: string;
  regularPrice?: number | null;
  promoPrice?: number | null;
  pricingUnit?: string;
  packageDetails?: string;
  options?: string[];
  sessions?: number;
  promotionName?: string;
  promotionStatus?: string;
  promotionExpiry?: string | null;
  pricingNote?: string;
  durationMinutes?: number;
  downtime?: string;
  recommendedSessions?: string;
  benefits?: string[];
  advertisedClaims?: string[];
  steps?: string[];
  targetAreas?: string[];
  image: string;
  popular?: boolean;
  isPromotion?: boolean;
  statusNote?: string;
}

export interface Promotion {
  id: string;
  name: string;
  category: 'slimming' | 'laser' | 'enhancement' | 'wellness' | 'facials';
  categoryLabel: string;
  packageDetails: string;
  sessionCount?: number;
  promoPrice: number;
  priceFormatted: string;
  pricingUnit?: string;
  regularPrice: null;
  priceLabel: 'Recent promotion';
  campaignName: string;
  brandLabel?: string;
  wording?: string;
  advertisedClaims: string[];
  options?: string[];
  targetAreas?: string[];
  inclusions?: string;
  statusNote: string;
  image: string;
  treatmentId: string;
  popular?: boolean;
}

export interface BerMonthsPromoItem {
  id: string;
  name: string;
  subtitle?: string;
  package?: string;
  pricingUnit?: string;
  options?: string[];
  sessions?: number;
  treatmentArea?: string;
  areas?: string[];
  inclusion?: string;
  promoPrice: number;
  regularPrice?: null;
  promotionName: string;
  promotionStatus: string;
  promotionExpiry: null;
  wording?: string;
  advertisedClaims?: string[];
  treatmentCategory?: 'facials' | 'slimming' | 'enhancement' | 'laser' | 'wellness';
  image: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  category: string;
  categoryLabel?: string;
  productType?: string;
  intendedUse?: string;
  availabilityNote?: string;
  priceFormatted: string;
  shortDescription: string;
  description?: string;
  keyDetails: {
    product: string;
    type: string;
    intendedUse: string;
    availability: string;
    price: string;
    confirmationNote: string;
  };
  displayedBenefits: string[];
  image: string;
  statusBadge?: string;
}

export interface TrainingCourse {
  id: string;
  title: string;
  subtitle: string;
  organization: string;
  duration?: string;
  description: string;
  topics?: string[];
  priceFormatted: string;
  pricingNote?: string;
  image: string;
  secondaryImage?: string;
  galleryImages?: string[];
  badge?: string;
  statusNote?: string;
  pinned?: boolean;
  featured?: boolean;
  isLatest?: boolean;
  priority?: number;
  date?: string;
  registrationDeadline?: string;
  slotsInfo?: string;
  location?: string;
  price?: number | null;
  highlights?: string[];
}

export interface TrainingAccreditation {
  trainingCenter: string;
  accreditingOrganization: string;
  department: string;
  accreditationStatus: string;
  certificateNumber: string;
  dateOfIssue: string;
  validUntil: string;
  founder: string;
  location: string;
  certificateImage: string;
  collaboration: {
    partnerName: string;
    location: string;
    noticeText: string;
    tesdaClarification: string;
    source: string;
  };
  conciseSummary: string;
  collaborationSummary: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  treatmentName: string;
  description: string;
  image: string;
  sourceNote?: string;
}

export interface FAQItem {
  id: string;
  category: 'general' | 'treatments' | 'products' | 'training' | 'payments';
  question: string;
  answer: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
}

export interface AppointmentBooking {
  treatmentId: string;
  treatmentName: string;
  preferredDate: string;
  preferredTime: string;
  fullName: string;
  phone: string;
  notes?: string;
}

export type MachineCategory = 'all' | 'facial' | 'laser' | 'hifu-lifting' | 'body-contouring';

export interface MachineItem {
  id: string;
  slug: string;
  name: string;
  category: MachineCategory[];
  categoryLabel: string;
  image: string;
  shortDescription: string;
  overview: string;
  functions: string[];
  benefits: string[];
  featured?: boolean;
  statusBadge: string;
  inquiryMessage: string;
  pricingDisplay?: string;
  availabilityNote?: string;
  inclusionsNote?: string;
  keyFeatures?: string[];
  clientConfirmationNote?: string;
}

