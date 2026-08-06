create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text not null unique,
  short_description text not null default '',
  description text not null default '',
  category text not null default '',
  price numeric not null default 0,
  compare_at_price numeric,
  cost numeric not null default 0,
  stock integer not null default 0,
  sku text not null default '',
  barcode text,
  images text[] not null default '{}',
  featured boolean not null default false,
  is_new boolean not null default false,
  is_promotion boolean not null default false,
  active boolean not null default true,
  meta_title text,
  meta_description text,
  rating numeric not null default 5,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Anon (public storefront) can only ever see active products. Admin reads
-- and every write go through the service role key from Server Actions,
-- which bypasses RLS — so there are intentionally no insert/update/delete
-- policies here.
drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
  on public.products
  for select
  to anon
  using (active = true);

-- Storage bucket for product images. Public read (so next/image and public
-- product pages can load the URLs directly); writes only via the service
-- role key (admin Server Actions), so no anon insert/update/delete policy.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
  on storage.objects
  for select
  to anon
  using (bucket_id = 'product-images');
