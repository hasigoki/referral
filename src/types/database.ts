// Database types for Supabase
// This file mirrors the database schema

export type UserRole = 'client' | 'referrer' | 'provider' | 'admin';
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type ProviderCategory = 
  | 'barber'
  | 'salon'
  | 'restaurant'
  | 'mechanic'
  | 'car_sales'
  | 'retail'
  | 'health'
  | 'fitness'
  | 'beauty'
  | 'home_services'
  | 'professional'
  | 'other';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      service_providers: {
        Row: ServiceProvider;
        Insert: Omit<ServiceProvider, 'id' | 'created_at' | 'updated_at' | 'total_transactions' | 'total_revenue' | 'average_rating'>;
        Update: Partial<Omit<ServiceProvider, 'id' | 'created_at'>>;
      };
      referral_codes: {
        Row: ReferralCode;
        Insert: Omit<ReferralCode, 'id' | 'created_at' | 'updated_at' | 'times_used' | 'total_earnings'>;
        Update: Partial<Omit<ReferralCode, 'id' | 'created_at'>>;
      };
      referral_code_uses: {
        Row: ReferralCodeUse;
        Insert: Omit<ReferralCodeUse, 'id' | 'used_at'>;
        Update: Partial<Omit<ReferralCodeUse, 'id' | 'used_at'>>;
      };
      transactions: {
        Row: Transaction;
        Insert: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Transaction, 'id' | 'created_at'>>;
      };
      wallets: {
        Row: Wallet;
        Insert: Omit<Wallet, 'id' | 'created_at' | 'updated_at' | 'available_balance' | 'pending_balance' | 'total_earned' | 'total_withdrawn'>;
        Update: Partial<Omit<Wallet, 'id' | 'created_at'>>;
      };
      payouts: {
        Row: Payout;
        Insert: Omit<Payout, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Payout, 'id' | 'created_at'>>;
      };
      wallet_transactions: {
        Row: WalletTransaction;
        Insert: Omit<WalletTransaction, 'id' | 'created_at'>;
        Update: never;
      };
    };
    Functions: {
      generate_referral_code: {
        Args: Record<string, never>;
        Returns: string;
      };
      is_first_interaction: {
        Args: { p_client_id: string; p_provider_id: string };
        Returns: boolean;
      };
      calculate_transaction_splits: {
        Args: {
          p_original_amount: number;
          p_client_discount_percent: number;
          p_referrer_commission_percent: number;
          p_platform_fee_bps?: number;
          p_is_referral?: boolean;
        };
        Returns: {
          discount_amount: number;
          final_amount: number;
          referrer_commission: number;
          platform_fee: number;
          provider_payout: number;
        }[];
      };
    };
  };
}

// Individual table types
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  stripe_customer_id: string | null;
  stripe_connect_account_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceProvider {
  id: string;
  owner_id: string;
  business_name: string;
  description: string | null;
  category: ProviderCategory;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  website: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  base_service_price: number;
  client_discount_percent: number;
  referrer_commission_percent: number;
  stripe_account_id: string | null;
  stripe_account_status: string;
  payouts_enabled: boolean;
  is_active: boolean;
  is_verified: boolean;
  total_transactions: number;
  total_revenue: number;
  average_rating: number | null;
  created_at: string;
  updated_at: string;
}

export interface ReferralCode {
  id: string;
  referrer_id: string;
  code: string;
  qr_code_data: string | null;
  times_used: number;
  total_earnings: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReferralCodeUse {
  id: string;
  referral_code_id: string;
  client_id: string;
  provider_id: string;
  transaction_id: string | null;
  used_at: string;
}

export interface Transaction {
  id: string;
  client_id: string;
  provider_id: string;
  referrer_id: string | null;
  referral_code_id: string | null;
  original_amount: number;
  discount_amount: number;
  final_amount: number;
  referrer_commission: number;
  platform_fee: number;
  provider_payout: number;
  is_first_interaction: boolean;
  stripe_payment_intent_id: string | null;
  stripe_charge_id: string | null;
  stripe_transfer_id: string | null;
  stripe_referrer_transfer_id: string | null;
  status: TransactionStatus;
  status_message: string | null;
  service_description: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface Wallet {
  id: string;
  user_id: string;
  available_balance: number;
  pending_balance: number;
  total_earned: number;
  total_withdrawn: number;
  stripe_bank_account_id: string | null;
  payout_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Payout {
  id: string;
  wallet_id: string;
  user_id: string;
  amount: number;
  status: PayoutStatus;
  stripe_payout_id: string | null;
  stripe_transfer_id: string | null;
  processed_at: string | null;
  failure_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  amount: number;
  balance_after: number;
  transaction_type: string;
  reference_id: string | null;
  description: string | null;
  created_at: string;
}

// Extended types with relations
export interface ServiceProviderWithOwner extends ServiceProvider {
  owner: Profile;
}

export interface TransactionWithDetails extends Transaction {
  client: Profile;
  provider: ServiceProvider;
  referrer: Profile | null;
  referral_code: ReferralCode | null;
}

export interface ReferralCodeWithReferrer extends ReferralCode {
  referrer: Profile;
}
