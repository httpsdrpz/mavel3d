-- Admin CMS: roles/first-admin, categories + settings off localStorage, Landing
-- Page content, differentiators, testimonials, and a general media library.
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query),
-- after supabase/schema.sql.

-- ---------------------------------------------------------------------------
-- admin_users — profile/role for Supabase Auth users. Auth itself (email +
-- hashed password) stays in auth.users via GoTrue; this table only adds the
-- "is this person allowed into /admin" bit. Service-role only — no anon/
-- authenticated policy, same posture as writes on `products`.
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  role text not null default 'ADMIN' check (role = 'ADMIN'),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Backfill: any Supabase Auth user that already existed before this
-- migration (e.g. the store owner's current login) becomes an active ADMIN,
-- so nobody gets locked out by this deploy.
insert into public.admin_users (id, name, role, active)
select id, coalesce(raw_user_meta_data ->> 'name', split_part(email, '@', 1)), 'ADMIN', true
from auth.users
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- categories — replaces the localStorage-only version. `products.category`
-- keeps storing the category *name* as free text (unchanged), so renames are
-- applied to both tables by the admin service, not by a foreign key.
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  icon text not null default 'Package',
  color text not null default '#7c3aed',
  description text not null default '',
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
  on public.categories
  for select
  to anon
  using (true);

insert into public.categories (name, icon, color, description)
values
  ('Fones', 'Headphones', '#7c3aed', 'Fones de ouvido e headphones para todos os estilos.'),
  ('Notebooks', 'Laptop', '#6d28d9', 'Notebooks para trabalho, estudo e criação.'),
  ('Smartphones', 'Smartphone', '#9333ea', 'Smartphones de última geração.'),
  ('Acessórios', 'Cable', '#a855f7', 'Acessórios que completam sua experiência tech.'),
  ('Wearables', 'Watch', '#8b5cf6', 'Smartwatches e pulseiras inteligentes.'),
  ('Monitores', 'Monitor', '#7e22ce', 'Monitores para produtividade e jogos.')
on conflict (name) do nothing;

-- ---------------------------------------------------------------------------
-- site_settings — singleton row (id = 1). Read by the whole storefront
-- (header/footer/theme color), written only by admin Server Actions.
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id int primary key default 1,
  store_name text not null default 'Marvel',
  logo_url text not null default '',
  favicon_url text not null default '',
  primary_color text not null default '#7c3aed',
  secondary_color text not null default '#a855f7',
  phone text not null default '',
  email text not null default '',
  instagram text not null default '',
  facebook text not null default '',
  whatsapp text not null default '',
  address text not null default '',
  copyright_text text not null default '',
  currency text not null default 'BRL',
  default_shipping_rate numeric not null default 0,
  constraint site_settings_singleton check (id = 1)
);

alter table public.site_settings enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings
  for select
  to anon
  using (true);

insert into public.site_settings (
  id, store_name, logo_url, favicon_url, primary_color, secondary_color, phone,
  email, instagram, facebook, whatsapp, address, copyright_text, currency,
  default_shipping_rate
)
values (
  1, 'Marvel', '', '', '#7c3aed', '#a855f7', '(11) 4002-8922',
  'contato@marvel.com', '@marvel', 'marvel', '(11) 98888-0000',
  'Av. Paulista, 1000 - São Paulo, SP', 'Todos os direitos reservados.', 'BRL', 39.9
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- landing_content — singleton row (id = 1), one jsonb column per editable
-- Home section. Seeded with the copy the components ship with today, so the
-- Home never renders empty even before an admin touches "Personalizar
-- Landing".
-- ---------------------------------------------------------------------------
create table if not exists public.landing_content (
  id int primary key default 1,
  hero jsonb not null default '{}'::jsonb,
  about jsonb not null default '{}'::jsonb,
  cta jsonb not null default '{}'::jsonb,
  constraint landing_content_singleton check (id = 1)
);

alter table public.landing_content enable row level security;

drop policy if exists "Public can read landing content" on public.landing_content;
create policy "Public can read landing content"
  on public.landing_content
  for select
  to anon
  using (true);

insert into public.landing_content (id, hero, about, cta)
values (
  1,
  '{
    "badge": "Impressão 3D Premium",
    "headline": "Sua imaginação ganha forma com impressão 3D.",
    "headlineHighlight": "ganha forma",
    "subheadline": "Na MAVEL, transformamos ideias em produtos exclusivos com impressão 3D de alta precisão. Criamos peças decorativas, utilitárias, colecionáveis e projetos personalizados com acabamento premium e atenção a cada detalhe.",
    "primaryButtonText": "Explorar Produtos",
    "primaryButtonLink": "/produtos",
    "secondaryButtonText": "Criar Projeto Personalizado",
    "secondaryButtonLink": "#personalizados",
    "imageUrl": "https://picsum.photos/seed/mavel-printer-hero/900/1125",
    "backgroundImageUrl": ""
  }'::jsonb,
  '{
    "eyebrow": "Sobre a MAVEL",
    "title": "Tecnologia, criatividade e inovação em cada detalhe.",
    "text": "A MAVEL nasceu para transformar criatividade em produtos reais. Utilizamos impressão 3D de alta qualidade para produzir peças únicas, funcionais e personalizadas, sempre com foco em acabamento, inovação e satisfação dos nossos clientes.",
    "imageUrl": "https://picsum.photos/seed/mavel-workshop/1000/750"
  }'::jsonb,
  '{
    "title": "Crie algo único.",
    "text": "Descubra nossa coleção ou solicite um projeto exclusivo desenvolvido especialmente para você.",
    "primaryButtonText": "Comprar Agora",
    "primaryButtonLink": "/produtos",
    "secondaryButtonText": "Ver Catálogo",
    "secondaryButtonLink": "/produtos",
    "imageUrl": ""
  }'::jsonb
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- differentiators — repeatable "Nossos diferenciais" cards.
-- ---------------------------------------------------------------------------
create table if not exists public.differentiators (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  icon text not null default 'Sparkles',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.differentiators enable row level security;

drop policy if exists "Public can read differentiators" on public.differentiators;
create policy "Public can read differentiators"
  on public.differentiators
  for select
  to anon
  using (true);

insert into public.differentiators (title, description, icon, sort_order)
select 'Precisão Profissional', 'Produção em alta definição para um acabamento impecável.', 'Target', 0
where not exists (select 1 from public.differentiators);

insert into public.differentiators (title, description, icon, sort_order)
select 'Personalização Total', 'Transforme sua ideia em uma peça única.', 'Wand2', 1
where not exists (select 1 from public.differentiators where title = 'Personalização Total');

insert into public.differentiators (title, description, icon, sort_order)
select 'Materiais de Alta Qualidade', 'Resistência, durabilidade e excelente acabamento.', 'ShieldCheck', 2
where not exists (select 1 from public.differentiators where title = 'Materiais de Alta Qualidade');

insert into public.differentiators (title, description, icon, sort_order)
select 'Produção Sob Demanda', 'Cada peça é produzida especialmente para você.', 'Factory', 3
where not exists (select 1 from public.differentiators where title = 'Produção Sob Demanda');

-- ---------------------------------------------------------------------------
-- testimonials — repeatable "O que dizem nossos clientes" cards.
-- ---------------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  photo_url text not null default '',
  text text not null default '',
  rating int not null default 5 check (rating between 1 and 5),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

drop policy if exists "Public can read testimonials" on public.testimonials;
create policy "Public can read testimonials"
  on public.testimonials
  for select
  to anon
  using (true);

insert into public.testimonials (name, role, text, rating, sort_order)
select 'Camila R.', 'Cliente MAVEL', 'Qualidade surpreendente. O acabamento ficou perfeito.', 5, 0
where not exists (select 1 from public.testimonials);

insert into public.testimonials (name, role, text, rating, sort_order)
select 'Rafael T.', 'Cliente MAVEL', 'Meu produto personalizado ficou exatamente como imaginei.', 5, 1
where not exists (select 1 from public.testimonials where name = 'Rafael T.');

insert into public.testimonials (name, role, text, rating, sort_order)
select 'Beatriz S.', 'Cliente MAVEL', 'Entrega rápida, ótimo atendimento e excelente qualidade.', 5, 2
where not exists (select 1 from public.testimonials where name = 'Beatriz S.');

-- ---------------------------------------------------------------------------
-- media_library — index of everything uploaded to the `media` bucket, so the
-- Biblioteca de Mídia can list/search without recursive storage.list() calls.
-- Service-role only (admin-only feature).
-- ---------------------------------------------------------------------------
create table if not exists public.media_library (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  url text not null,
  folder text not null default 'products',
  filename text not null,
  size bigint not null default 0,
  mime_type text not null default '',
  created_at timestamptz not null default now()
);

alter table public.media_library enable row level security;

-- ---------------------------------------------------------------------------
-- Storage bucket for the media library (separate from `product-images`, so
-- the existing product upload flow is untouched). Public read, writes only
-- through the service-role key.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public can read media library" on storage.objects;
create policy "Public can read media library"
  on storage.objects
  for select
  to anon
  using (bucket_id = 'media');
