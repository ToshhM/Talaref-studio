-- Security tables for paid reservations.
-- Apply this in Supabase SQL Editor before wiring webhook fulfillment to the DB.

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique,
  stripe_payment_intent_id text unique,
  customer_email text not null,
  customer_phone text not null,
  customer_first_name text not null,
  customer_last_name text not null,
  service text not null,
  reservation_date date not null,
  reservation_slot time not null,
  duration_hours integer not null check (duration_hours > 0),
  payment_mode text not null check (payment_mode in ('full', 'deposit')),
  amount_total_cents integer not null check (amount_total_cents > 0),
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'paid', 'cancelled', 'expired')),
  metadata jsonb not null default '{}'::jsonb,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Prevent two active reservations from occupying the exact same start slot.
-- For stricter overlap protection, replace this with a tstzrange exclusion
-- constraint once reservation start/end timestamps are persisted.
create unique index if not exists reservations_active_slot_unique
  on public.reservations (reservation_date, reservation_slot)
  where status in ('pending_payment', 'paid');

create table if not exists public.processed_stripe_sessions (
  stripe_session_id text primary key,
  reservation_id uuid references public.reservations(id) on delete set null,
  processed_at timestamptz not null default now()
);

alter table public.reservations enable row level security;
alter table public.processed_stripe_sessions enable row level security;

-- These tables should be written only from trusted server code using the
-- Supabase service role key, never from the browser anon key.
