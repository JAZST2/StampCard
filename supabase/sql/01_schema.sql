-- StampCard canonical schema (MVP)
create extension if not exists pgcrypto;

create type public.transaction_type as enum ('earn', 'redeem');
create type public.claim_status as enum ('pending', 'claimed', 'expired');

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text,
  name text,
  created_at timestamptz not null default now()
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.stamp_cards (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  total_stamps int not null check (total_stamps > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.stamp_milestones (
  id uuid primary key default gen_random_uuid(),
  stamp_card_id uuid not null references public.stamp_cards(id) on delete cascade,
  stamp_count int not null check (stamp_count > 0),
  reward_description text not null,
  is_claimable boolean not null default true,
  created_at timestamptz not null default now(),
  unique (stamp_card_id, stamp_count)
);

create table if not exists public.user_stamp_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  stamp_card_id uuid not null references public.stamp_cards(id) on delete cascade,
  current_stamps int not null default 0 check (current_stamps >= 0),
  last_reward_claimed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, stamp_card_id)
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  stamp_card_id uuid not null references public.stamp_cards(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  type public.transaction_type not null,
  points int not null check (points > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.reward_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  business_id uuid not null references public.businesses(id) on delete cascade,
  stamp_card_id uuid not null references public.stamp_cards(id) on delete cascade,
  milestone_id uuid not null references public.stamp_milestones(id) on delete restrict,
  status public.claim_status not null default 'pending',
  claimed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_reward_claims_status_business
  on public.reward_claims(status, business_id);

create index if not exists idx_transactions_user_card_created
  on public.transactions(user_id, stamp_card_id, created_at desc);
