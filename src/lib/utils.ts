import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format cents to currency string
 */
export function formatCurrency(cents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format date
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * Generate QR code URL for a referral code
 */
export function generateReferralUrl(code: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}/r/${code}`;
}

/**
 * Truncate string
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Parse referral code from various formats
 */
export function parseReferralCode(input: string): string | null {
  // Direct code (8 characters alphanumeric)
  if (/^[A-Z0-9]{8}$/i.test(input)) {
    return input.toUpperCase();
  }
  
  // URL format: /r/CODE or ?ref=CODE
  const urlMatch = input.match(/\/r\/([A-Z0-9]{8})/i) || 
                   input.match(/[?&]ref=([A-Z0-9]{8})/i);
  if (urlMatch) {
    return urlMatch[1].toUpperCase();
  }
  
  // JSON format from QR code
  try {
    const parsed = JSON.parse(input);
    if (parsed.code && /^[A-Z0-9]{8}$/i.test(parsed.code)) {
      return parsed.code.toUpperCase();
    }
  } catch {
    // Not JSON
  }
  
  return null;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Category display names
 */
export const CATEGORY_LABELS: Record<string, string> = {
  barber: 'Barber Shop',
  salon: 'Hair Salon',
  restaurant: 'Restaurant',
  mechanic: 'Auto Mechanic',
  car_sales: 'Car Sales',
  retail: 'Retail Store',
  health: 'Healthcare',
  fitness: 'Fitness & Gym',
  beauty: 'Beauty & Spa',
  home_services: 'Home Services',
  professional: 'Professional Services',
  other: 'Other',
};

/**
 * Get category label
 */
export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category;
}
