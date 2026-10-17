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
  external service. `db:push` and `db:seed-admin` use the same local
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

- `/` — hero with live Gold, S&P 500 and BTC quotes, activity ticker (real
  depositor/withdrawer names + amounts), asset classes, platforms,
  investments, account tiers and testimonials.
- `/pricing` — Starter ($50–$300), Standard ($500–$2,000) and Professional
  ($5,000+), each with 35% monthly / 60% quarterly return on investment.
- `/platforms`, `/investments`, `/about`, `/contact`.
- Education and Markets pages were removed; `/education` and `/markets`
  redirect to `/`.
- MetaTrader was removed from the platform and all marketing copy.

Hero quotes are fetched server-side from Yahoo Finance and refreshed in the
browser every 30 seconds. If the provider is unreachable, the last fallback
values are shown instead of empty cards.

### Client portal (`/dashboard`)

- Overview with real balances, total deposited/withdrawn and a responsive
  recent-transactions list.
- Portfolio, wallet, KYC uploads, documents, support and settings.
- **Deposit** — QR-code payment panel only (image and address are managed by
  an admin). The client confirms the amount/reference, creating a `Pending`
  transaction.
- **Withdraw** — amount + payout method, also `Pending` until reviewed.
- **Notifications** — read-only feed of messages sent by an admin (broadcast
  or targeted).

Balances do **not** move when a request is submitted. They move when the
transaction is marked `Successful`.

### Admin console (`/admin`)

- Overview KPIs, users (edit balances/tier/role/KYC, reset passwords),
  analytics and KYC review.
- **Deposits & Withdrawals** — mark pending requests `Successful` (credits
  deposits, debits withdrawals, guarded against negative balances) or
  `Rejected`.
- **Notifications** — compose a message and send it to all clients or one
  client.
- **Settings** — replace the deposit QR image, address and instructions.
- **Users → Reset password** — set a new password for any client or admin
  account.

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

## Notes

- `lib/market-data.ts` powers the portfolio growth chart and admin revenue
  charts with local sample series; balances, transactions, KYC and
  notifications are database-backed.
- The admin toggles on Settings are UI-only.
- Buy/sell order placement no longer exists in the client portal.
