-- Table for paid studio/photographer/podcast/formation bookings created via the
-- Stripe checkout flow (src/app/api/webhooks/stripe/route.ts). Apply this in the
-- Supabase SQL Editor. Until this table exists, these bookings are only ever
-- visible in the Google Calendar / email notifications, never in /admin/bookings.

create table if not exists public.studio_bookings (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  siret text,
  company_name text,
  service text not null,
  booking_date date not null,
  formatted_date text,
  slot text not null,
  duration numeric not null,
  payment_mode text not null default 'full'
    check (payment_mode in ('full', 'deposit')),
  amount_paid_cents integer not null,
  message text,
  client_email_sent_at timestamptz,
  admin_email_sent_at timestamptz,
  review_email_sent_at timestamptz,
  status text not null default 'confirmed'
    check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.studio_bookings
  add column if not exists client_email_sent_at timestamptz,
  add column if not exists admin_email_sent_at timestamptz,
  add column if not exists review_email_sent_at timestamptz;

create index if not exists studio_bookings_booking_date_idx
  on public.studio_bookings (booking_date);

alter table public.studio_bookings enable row level security;

-- No public policies: this table is written and read only from trusted
-- server code using the Supabase service role key, never from the browser anon key.
