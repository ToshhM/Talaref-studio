-- Apply after studio-bookings.sql, before deploying the promo-code feature.
begin;
create table if not exists public.creator_promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9_-]{3,40}$'),
  creator_name text not null check (length(trim(creator_name)) between 1 and 100),
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10,2) not null check (discount_value > 0 and discount_value <= 100000),
  service_ids text[] not null check (cardinality(service_ids) > 0 and service_ids <@ array['location-studio','prestation-photographe','podcasts','formations']::text[]),
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (discount_type <> 'percentage' or discount_value < 100)
);
alter table public.creator_promo_codes enable row level security;
-- No public policies: all reads/writes go through server-side service-role code.
revoke all on public.creator_promo_codes from anon, authenticated;
grant all on public.creator_promo_codes to service_role;

alter table public.studio_bookings
  add column if not exists promo_code_id uuid references public.creator_promo_codes(id),
  add column if not exists promo_code text,
  add column if not exists promo_creator_name text,
  add column if not exists original_amount_cents integer,
  add column if not exists discount_amount_cents integer,
  add column if not exists total_amount_cents integer;
create index if not exists studio_bookings_promo_code_idx on public.studio_bookings(promo_code_id) where promo_code_id is not null;
commit;
