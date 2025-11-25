# Refer App

A complete referral-based discount and passive income platform built with Next.js, Supabase, and Stripe Connect.

![Refer App](https://via.placeholder.com/800x400?text=Refer+App)

## Overview

Refer App enables a three-way marketplace where:
- **Clients** get discounts on their first visit to participating businesses
- **Referrers** earn passive income by sharing their unique QR codes
- **Service Providers** acquire new customers through word-of-mouth marketing

### How the Payment Split Works

When a referred client makes their first purchase at a business:

```
Original Service Price: $30.00
├── Client Discount (5%): -$1.50
├── Client Pays: $28.50
│   ├── Referrer Commission (8% of original): $2.40
│   ├── Platform Fee (2%): $0.57
│   └── Provider Receives: $25.53
```

**Fair Distribution:**
- Client saves money (5% off)
- Referrer earns commission (8%) for the introduction
- Provider pays only for successful customer acquisition
- Platform takes a small fee (2%) to operate

## Features

### For Referrers
- 🎯 **One-tap QR Code** - Instantly display your unique referral code
- 💰 **Real-time Earnings** - Track commissions as they come in
- 📊 **Dashboard Analytics** - See how your referrals are performing
- 💳 **Easy Withdrawals** - Cash out when you hit $10 minimum

### For Service Providers
- 📱 **Fast QR Scanner** - Validate referral codes instantly
- 💵 **Instant Settlements** - Get paid immediately via Stripe Connect
- 📈 **Transaction Breakdown** - See exactly how each payment splits
- ⚙️ **Configurable Rates** - Set your own discount and commission percentages

### For Clients
- 🎁 **Instant Discounts** - Save on your first visit
- 🔍 **Discover Services** - Find participating businesses near you
- 📱 **No App Required** - Works with any QR scanner

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase Edge Functions
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Payments**: Stripe Connect for marketplace payments
- **Auth**: Supabase Auth with magic links and OAuth
- **QR Codes**: qrcode.react for generation, html5-qrcode for scanning

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (with Connect enabled)

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/refer-app.git
cd refer-app
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the migration to create the database schema:
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

3. Enable Row Level Security (already configured in migration)

4. Set up authentication providers (Email, Google, etc.) in the Supabase dashboard

### 3. Set Up Stripe Connect

1. Go to your Stripe Dashboard → Connect → Settings
2. Enable Express accounts
3. Configure your branding and payout settings
4. Get your API keys

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Set Up Stripe Webhooks

For local development:
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login and forward webhooks
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret to your `.env.local`.

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
refer-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── payments/      # Payment intents
│   │   │   ├── webhooks/      # Stripe webhooks
│   │   │   ├── connect/       # Stripe Connect onboarding
│   │   │   └── referral/      # Referral validation
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── referrer/          # Referrer QR code page
│   │   ├── provider/          # Provider management
│   │   ├── scan/              # QR code scanner
│   │   ├── wallet/            # Wallet & payouts
│   │   └── r/[code]/          # Referral landing pages
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── layout/            # Layout components
│   │   ├── QRCodeDisplay.tsx  # QR code generation
│   │   ├── QRCodeScanner.tsx  # QR code scanning
│   │   └── ...
│   ├── lib/
│   │   ├── supabase/          # Supabase clients
│   │   ├── stripe/            # Stripe utilities
│   │   └── utils.ts           # Helper functions
│   ├── hooks/                 # Custom React hooks
│   └── types/                 # TypeScript types
├── supabase/
│   └── migrations/            # Database migrations
└── public/                    # Static assets
```

## Database Schema

### Core Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User accounts extending Supabase auth |
| `service_providers` | Business listings |
| `referral_codes` | Unique codes for each referrer |
| `referral_code_uses` | Tracks one-time use per client-provider |
| `transactions` | Payment records with full split breakdown |
| `wallets` | Referrer earnings balance |
| `payouts` | Withdrawal requests |
| `wallet_transactions` | Ledger of all wallet changes |

### Key Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Automated Triggers**: Wallet updates, referral code generation, stats tracking
- **Database Functions**: First-interaction checks, split calculations

## API Reference

### POST `/api/payments/create-intent`

Creates a payment intent for a transaction.

```typescript
// Request
{
  providerId: string;
  referralCode?: string;
}

// Response
{
  clientSecret: string;
  splits: TransactionSplits;
  isFirstInteraction: boolean;
  hasReferral: boolean;
  referrerName?: string;
}
```

### GET `/api/referral/validate`

Validates a referral code.

```typescript
// Query params
?code=ABCD1234&providerId=uuid

// Response
{
  valid: boolean;
  code?: string;
  referrer?: {
    id: string;
    name: string;
    avatar?: string;
  };
  error?: string;
}
```

### POST `/api/connect/onboard`

Creates or refreshes Stripe Connect onboarding link.

```typescript
// Response
{
  url: string;
  accountId: string;
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

## Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `PLATFORM_FEE_BPS` | 200 | Platform fee in basis points (200 = 2%) |
| `DEFAULT_CLIENT_DISCOUNT_PERCENT` | 5 | Default discount for clients |
| `DEFAULT_REFERRER_COMMISSION_PERCENT` | 8 | Default referrer commission |
| `MIN_WITHDRAWAL_AMOUNT` | 1000 | Minimum withdrawal in cents ($10) |

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see LICENSE file for details.

## Support

- 📧 Email: support@referapp.com
- 💬 Discord: [Join our community](https://discord.gg/referapp)
- 📖 Docs: [docs.referapp.com](https://docs.referapp.com)

---

Built with ❤️ using Next.js, Supabase, and Stripe
