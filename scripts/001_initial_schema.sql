-- =============================================================
-- ShopSphere  |  Migration 001 — Initial Schema
-- Run once in: Supabase Dashboard → SQL Editor → New Query
-- DO NOT run again — changes belong in a new numbered script
-- =============================================================

-- ─── EXTENSIONS ───────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── USERS ────────────────────────────────────────────────────
create table if not exists public.users (
  id          uuid primary key default uuid_generate_v4(),
  name        text        not null,
  email       text        not null unique,
  password    text        not null,          -- plain text (no heavy auth per spec)
  role        text        not null default 'user',  -- 'user' | 'admin'
  created_at  timestamptz not null default now()
);

-- seed two default accounts
insert into public.users (name, email, password, role) values
  ('Demo User',  'demo@shopsphere.in',  'demo1234',  'user'),
  ('Admin User', 'admin@shopsphere.in', 'admin1234', 'admin')
on conflict (email) do nothing;

-- ─── PRODUCTS ─────────────────────────────────────────────────
create table if not exists public.products (
  id             text        primary key,
  name           text        not null,
  category       text        not null,
  subcategory    text        not null,
  price          integer     not null,
  original_price integer     not null,
  discount       integer     not null default 0,
  rating         numeric(2,1) not null default 4.0,
  review_count   integer     not null default 0,
  stock          integer     not null default 50,
  brand          text        not null,
  description    text        not null default '',
  features       text[]      not null default '{}',
  images         text[]      not null default '{}',
  tags           text[]      not null default '{}',
  created_at     timestamptz not null default now()
);

-- ─── ORDERS ───────────────────────────────────────────────────
create table if not exists public.orders (
  id              text        primary key,
  user_id         uuid        references public.users(id) on delete set null,
  items           jsonb       not null default '[]',
  total           integer     not null,
  status          text        not null default 'Processing',
  address         jsonb       not null,
  payment_method  text        not null default 'UPI',
  created_at      timestamptz not null default now()
);

-- ─── ROW LEVEL SECURITY (permissive for now — no Supabase Auth) ─
alter table public.users    enable row level security;
alter table public.products enable row level security;
alter table public.orders   enable row level security;

-- Allow all operations via service/anon key (API routes handle auth logic)
create policy "allow_all_users"    on public.users    for all using (true) with check (true);
create policy "allow_all_products" on public.products for all using (true) with check (true);
create policy "allow_all_orders"   on public.orders   for all using (true) with check (true);
