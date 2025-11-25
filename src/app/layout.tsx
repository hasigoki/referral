import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Refer - Earn While You Share',
  description: 'Referral-based discounts and passive income platform. Get discounts, grow your business, and earn commissions.',
  keywords: ['referral', 'discount', 'passive income', 'rewards', 'business'],
  authors: [{ name: 'Refer App' }],
  openGraph: {
    title: 'Refer - Earn While You Share',
    description: 'Get discounts on your first visit. Earn commissions by referring friends.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#f59e0b',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
