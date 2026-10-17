# Meridian Capital — Next.js + Tailwind

Investment platform with a marketing site, client portal and admin console.
No ORM — plain SQL via `@neondatabase/serverless` in production, with an
embedded PGlite database for zero-config local development. Auth is
hand-rolled (bcrypt + JWT session cookie).

## Requirements

- **Node.js 20.9.0+** (Next.js 16 requires it — check with `node -v`)
- **TypeScript 5.1+** (pinned in `package.json`)

## Setup

```bash
npm install
cp .env.example .env.local   # fill in AUTH_SECRET and the admin credentials
npm run db:push              # applies db/schema.sql
npm run db:seed-admin        # creates the admin account from .env.local
npm run dev
```

Open http://localhost:3000.

### Database

- **Local development (default):** if `DATABASE_URL` is not set, the app runs
  an embedded Postgres (PGlite) persisted to `.pglite/`. No Docker, no
  external service. `db:push` and the seed scripts use the same local
  database.
- **Production:** set `DATABASE_URL` to a Neon (or any Postgres) connection
  string. The app then uses Neon's HTTP driver as before.

`AUTH_SECRET` — generate with `openssl rand -base64 32`.

### Admin account

`npm run db:seed-admin` creates or promotes the account defined by
`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_FIRST_NAME` and `ADMIN_LAST_NAME`
in `.env.local`. The seeded deployment uses:

```
ADMIN_EMAIL=sirray812@digdig.org
```

The password lives in `.env.local` (gitignored). Re-running the script
promotes the account if it exists and resets its password.

### Email (optional)

Set `RESEND_API_KEY` and `EMAIL_FROM` to send welcome/contact/transaction
receipts. Without a key, sends are logged and skipped so local flows never
fail.

## What's wired

### Marketing site

- `/` — hero, activity ticker (real depositor/withdrawer names + amounts),
  markets, platforms, investments, account tiers, testimonials.
- `/pricing` — Starter ($50–$300), Standard ($500–$2,000) and Professional
  ($5,000+), each with 35% monthly / 60% quarterly return on investment.
- `/markets`, `/platforms`, `/investments`, `/about`, `/contact`.
- Education was removed; `/education` redirects to `/`.
- MetaTrader was removed from the platform and all marketing copy.

### Client portal (`/dashboard`)

- Overview with real balances, total deposited/withdrawn and recent
  transactions.
- Portfolio, wallet, KYC uploads, documents, support and settings.
- **Deposit** — QR-code payment panel only (image and address are managed by
  an admin). The client confirms the amount/reference, creating a `Pending`
  transaction.
- **Withdraw** — amount + payout method, also `Pending` until reviewed.
- **Notifications** — read-only feed of messages sent by an admin (broadcast
  or targeted).

Balances do **not** move when a request is submitted. They move only when an
administrator marks the transaction `Successful`.

### Admin console (`/admin`)

- Overview KPIs, users (edit balances/tier/role/KYC), analytics, KYC review.
- **Deposits & Withdrawals** — mark pending requests `Successful` (credits
  deposits, debits withdrawals, guarded against negative balances) or
  `Rejected`.
- **Notifications** — compose a message and send it to all clients or one
  client.
- **Settings** — replace the deposit QR image, address and instructions.

## Statuses

| Table | Values |
|---|---|
| `transactions.status` | `Pending`, `Successful`, `Rejected` |
| `kyc_documents.status` | `Pending`, `Under Review`, `Approved`, `Rejected` |
| `users.kyc_status` | `Not Started`, `In Review`, `Verified`, `Rejected` |

## Database tables

`users`, `transactions`, `kyc_documents`, `notifications`,
`platform_settings`, `contact_messages`, `sessions`.

`db/schema.sql` is idempotent and is re-applied automatically on local boot,
so adding a table just means adding it to that file.

## Still illustrative

- `lib/market-data.ts` powers the markets list, portfolio growth chart and
  admin revenue charts with static demo data; the balances and transaction
  history around them are real.
- Wallet-to-wallet transfers and the admin toggles on Settings are UI-only.
- Buy/sell order placement no longer exists in the client portal.
