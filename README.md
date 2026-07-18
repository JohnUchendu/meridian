# Meridian Capital — Next.js + Tailwind + Neon + Resend

Converted from the original TanStack Start (Lovable) project. No Prisma —
raw SQL via `@neondatabase/serverless`. Auth is hand-rolled (bcrypt + JWT
session cookie), no third-party auth provider.

## Requirements

- **Node.js 20.9.0+** (Next.js 16 hard requirement — check with `node -v`)
- **TypeScript 5.1+** (already pinned in `package.json`)

## Next.js 16

Running on Next.js 16.2.10 / React 19.2.3 (the current stable release as of
this writing) with Turbopack as the default bundler — `npm run dev` and
`npm run build` now use it automatically, no flag needed.

Next.js has shipped several security patches in quick succession recently
(a critical RCE, CVE-2025-66478, plus two follow-up DoS/source-exposure
CVEs in Dec 2025). Before deploying, run `npm outdated next` and check
https://nextjs.org/blog for anything newer than what's pinned here — don't
assume the version in `package.json` is still the safe one by the time you
read this.

`npm audit` may report a moderate `postcss` advisory nested inside
`node_modules/next/node_modules/postcss` — that's a dependency bundled
inside Next.js itself, not something this project controls directly, and
`npm audit fix --force` will try to "fix" it by downgrading Next to 9.x
(don't do that). It should clear on its own in a future Next.js patch.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL, AUTH_SECRET, RESEND_API_KEY
npm run db:push              # applies db/schema.sql to Neon
npm run dev
```

`AUTH_SECRET` — generate with `openssl rand -base64 32`.
`RESEND_API_KEY` — from resend.com; verify a sending domain or use the
resend.dev sandbox for `EMAIL_FROM` during development.

## What's fully wired (real DB + email, not mocked)

- **Auth** (`app/auth/`) — register/login/logout as Next.js Server Actions.
  Passwords hashed with bcrypt, sessions are signed JWTs in an httpOnly
  cookie (`lib/auth.ts`). `sendWelcomeEmail` fires on register.
- **Contact form** (`app/contact/`) — writes to `contact_messages`, sends a
  receipt email via Resend.
- **Dashboard overview** (`app/dashboard/page.tsx`) — reads real balances
  and the 5 most recent transactions for the signed-in user from Neon.
- **Deposit/Withdraw** (`app/dashboard/deposit/`) — writes to `transactions`,
  updates `users.balance_available`, sends a confirmation email, and
  revalidates the dashboard.
- **Route protection** — `app/dashboard/layout.tsx` redirects to `/auth` if
  there's no valid session (server-side, via `getCurrentUser()`).

## Also now fully wired (added in this pass)

- **Admin console** (`app/admin/`) — role-gated layout (`role === 'admin'`
  redirects non-admins to `/dashboard`). Overview KPIs, Users list,
  Deposits/Withdrawals (with real Approve/Reject buttons that update
  `transactions.status` and reverse balance changes on rejection), and
  KYC Review (Approve/Reject writes `users.kyc_status`) all read/write
  Neon directly.
- **Settings → Profile** (`app/dashboard/settings/`) — first/last name and
  email now write to `users` via a server action, with email-collision
  checking.
- **Client KYC page** (`app/dashboard/kyc/`) — "Upload" inserts a row into
  `kyc_documents` and flips `users.kyc_status` to "In Review"; an admin
  then approves/rejects it from `/admin/kyc`. Actual file bytes aren't
  stored yet (see below).
- **Admin seed script** (`db/seed-admin.ts`) — creates or promotes an
  admin user: `ADMIN_EMAIL=you@x.com ADMIN_PASSWORD=... npm run db:seed-admin`
- **Demo client seed script** (`db/seed-demo.ts`) — creates a normal
  (non-admin) client user with sample balances and transactions, so you
  can log in and see the client dashboard populated:
  `npm run db:seed-demo` (defaults to `demo@meridian.example` /
  `demopassword123`, or set `DEMO_EMAIL`/`DEMO_PASSWORD` env vars).
- **Admin → per-user edit page** (`app/admin/users/[id]/`) — click any
  row in `/admin/users` to open it. Admins can edit name/email, role,
  tier, KYC status, and directly set available/trading/bonus balances
  (bypassing the deposit/withdrawal flow), or delete the account.

## What's still mock/demo or stubbed

- Marketing pages: `/`, `/about`, `/markets`, `/platforms`, `/investments`,
  `/education`, `/pricing` — static content, same as the original.
- `/dashboard/trading`, `/dashboard/portfolio`, `/dashboard/wallet`,
  `/dashboard/notifications` — still render `lib/market-data.ts` mock
  arrays (no real trading engine exists to back live prices/positions).
- `/admin/analytics` — the two charts (client acquisition, volume by
  asset class) still use `revenueSeries`/`allocation` demo data; the KPI
  cards above them are real. Swap the chart data source for a real
  `transactions` time-series query when you have enough data to make
  that meaningful.
- **KYC file uploads** — real. Files (JPG/PNG/WebP/PDF, capped at 5MB) are
  read into a `Buffer` in the server action and stored directly in Neon as
  a `bytea` column (`kyc_documents.file_data`), no third-party storage
  provider. Served back via `app/api/kyc-documents/[id]/route.ts`, which
  checks the requester is either the document's owner or an admin before
  streaming the bytes. Client-side JS also blocks oversized files before
  upload, but the 5MB cap is enforced server-side too (`MAX_KYC_FILE_BYTES`
  in `app/dashboard/kyc/actions.ts`) since client checks are never trustworthy
  on their own. `/dashboard/documents` and `/admin/kyc` both link to the
  stored files. Worth knowing: Neon's HTTP driver hex-encodes binary
  payloads, roughly doubling the wire size, and caps requests/responses at
  64MB — 5MB files are nowhere near that ceiling, but don't raise the cap
  much past ~20MB without switching to the WebSocket-based `Pool`/`Client`
  instead of the HTTP `neon()` client used here.
- **Settings → Security/Notifications toggles** — UI only. Add a
  `user_preferences` table and wire with the same action pattern as
  `ProfileForm`.

## Remaining shadcn/ui components not yet copied over

I ported the ones actually used by the pages built so far (button, card,
input, label, badge, tabs, checkbox, switch, separator, progress,
textarea, sheet, accordion, sonner). The rest (dialog, dropdown-menu,
select, popover, tooltip, calendar, carousel, chart, command,
context-menu, menubar, navigation-menu, pagination, radio-group,
resizable, scroll-area, sidebar, skeleton, slider, toggle, toggle-group,
avatar, alert, alert-dialog, breadcrumb, collapsible, drawer, form,
input-otp) are framework-agnostic Radix wrappers from the original source
— copy them into `components/ui/` unchanged, they don't reference
TanStack Router or anything Next-specific.

## Route mapping reference

| Old (TanStack Start) | New (Next.js App Router) |
|---|---|
| `routes/__root.tsx` | `app/layout.tsx` |
| `routes/index.tsx` | `app/page.tsx` |
| `routes/dashboard.tsx` + children | `app/dashboard/layout.tsx` + `app/dashboard/*/page.tsx` |
| `routes/admin.tsx` + children | `app/admin/layout.tsx` + `app/admin/*/page.tsx` |
| `<Link to="...">` | `<Link href="...">` (next/link) |
| `useRouterState({ select })` | `usePathname()` (next/navigation) |
| `useNavigate()` | `useRouter()` (next/navigation) |
| `createFileRoute(...).head()` | `export const metadata` / `generateMetadata()` |
| `notFoundComponent` | `app/not-found.tsx` |
| `errorComponent` | `app/error.tsx` |

## Database

Schema lives in `db/schema.sql`, applied by `db/migrate.ts` (plain SQL,
split on `;` and executed statement-by-statement over the Neon HTTP
driver — no migration framework). Tables: `users`, `kyc_documents`,
`transactions`, `contact_messages`, `sessions` (sessions table is defined
for future server-side session revocation; current auth is stateless JWT
so it's not required yet).

## Next steps to finish the port

1. Copy remaining `components/ui/*` files verbatim from the original source.
2. Build out `/admin` pages the same way as the dashboard: server
   component fetches from Neon, passes rows to a client component if
   charts/interactivity are needed.
3. Wire `/dashboard/settings` profile form to `UPDATE users ...`.
4. ~~Add file upload for KYC docs~~ — done; files are stored as `bytea` in
   Neon directly (see above), no separate storage provider needed.
5. Add an admin-only middleware check (role === 'admin') mirroring
   `dashboard/layout.tsx`.
