export * from './database';

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form types
export interface SignUpFormData {
  email: string;
  password: string;
  fullName: string;
  role: 'client' | 'referrer' | 'provider';
}

export interface ProviderSignUpFormData extends SignUpFormData {
  businessName: string;
  category: string;
  baseServicePrice: number;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
}

// Payment types
export interface PaymentIntentData {
  amount: number;
  providerId: string;
  referralCode?: string;
  clientId: string;
}

export interface TransactionSplits {
  originalAmount: number;
  discountAmount: number;
  finalAmount: number;
  referrerCommission: number;
  platformFee: number;
  providerPayout: number;
}

// QR Code types
export interface QRCodeData {
  type: 'referral';
  code: string;
  referrerId: string;
  timestamp: number;
}

// UI State types
export interface ScanResult {
  referralCode: string;
  referrerId: string;
  isValid: boolean;
  referrerName?: string;
}
