-- Meridian Capital schema — plain SQL for Neon Postgres (no ORM).
-- Run with: psql $DATABASE_URL -f db/schema.sql  (or via db/migrate.ts)

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null default 'client', -- 'client' | 'admin'
  tier text not null default 'Starter', -- Starter | Standard | Professional | VIP
  kyc_status text not null default 'Not Started', -- Not Started | In Review | Verified | Rejected
  balance_available numeric(14,2) not null default 0,
  balance_trading numeric(14,2) not null default 0,
  balance_bonus numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists kyc_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  doc_type text not null, -- passport | drivers_license | proof_of_address | selfie
  file_name text,
  mime_type text,
  file_size integer,
  file_data bytea, -- actual file bytes, stored directly in Neon (capped at 5MB in app code)
  status text not null default 'Pending', -- Pending | Under Review | Approved | Rejected
  created_at timestamptz not null default now()
);

-- Safe to re-run against an already-migrated database: adds the file
-- storage columns if this table was created before they existed.
alter table kyc_documents add column if not exists file_name text;
alter table kyc_documents add column if not exists mime_type text;
alter table kyc_documents add column if not exists file_size integer;
alter table kyc_documents add column if not exists file_data bytea;

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null, -- Deposit | Withdrawal
  amount numeric(14,2) not null,
  method text not null, -- Card | Bank wire | Crypto
  status text not null default 'Pending', -- Pending | Completed | Rejected
  created_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_transactions_user on transactions(user_id);
create index if not exists idx_kyc_user on kyc_documents(user_id);
