-- Table for the free "Shooting Day Spécial Congolais" event bookings.
-- Apply this in the Supabase SQL Editor.

create table if not exists public.event_bookings (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  event_date date not null,
  slot text not null,
  message text,
  client_email_sent_at timestamptz,
  admin_email_sent_at timestamptz,
  review_email_sent_at timestamptz,
  status text not null default 'confirmed'
    check (status in ('confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.event_bookings
  add column if not exists client_email_sent_at timestamptz,
  add column if not exists admin_email_sent_at timestamptz,
  add column if not exists review_email_sent_at timestamptz;

-- Prevent two confirmed bookings from occupying the same slot on the same day.
create unique index if not exists event_bookings_active_slot_unique
  on public.event_bookings (event_date, slot)
  where status = 'confirmed';

alter table public.event_bookings enable row level security;

-- No public policies: this table is written and read only from trusted
-- server code using the Supabase service role key, never from the browser anon key.
