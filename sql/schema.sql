-- ============================================================
--  Ejecuta este script en Supabase > SQL Editor (una sola vez)
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists animals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  species text not null,
  sex text not null,
  age text,
  description text,
  tags text[] default '{}',
  photos text[] default '{}',
  created_at timestamp with time zone default now()
);

-- Activamos Row Level Security (seguridad a nivel de fila)
alter table animals enable row level security;

-- Cualquier persona puede LEER la lista de animales (para la web pública)
create policy "Lectura pública de animales"
  on animals for select
  using (true);

-- Nadie puede insertar/editar/borrar usando la clave pública (anon).
-- Solo nuestro backend (con la service_role key, que salta el RLS)
-- puede hacerlo, y ya está protegido por el login de administrador.

-- ============================================================
--  Cuentas de acceso al panel (voluntarios y superadmin)
-- ============================================================
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  role text not null default 'voluntario' check (role in ('superadmin', 'voluntario')),
  created_at timestamp with time zone default now()
);

-- Activamos RLS y NO creamos ninguna política de acceso público:
-- esto significa que nadie puede leer ni modificar esta tabla usando
-- la clave pública (anon). Solo el backend, con la service_role key,
-- puede acceder a ella (y ya está protegido por el login).
alter table admin_users enable row level security;

-- ============================================================
--  Campañas de recaudación (campamentos, sorteos, merchandising...)
-- ============================================================
create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  info2 text, -- el cuadro "¿Te interesa?" con cómo participar/comprar
  start_date date not null default current_date,
  end_date date, -- opcional: si es NULL, la campaña no tiene fecha de fin
  photos text[] default '{}',
  created_at timestamp with time zone default now()
);

alter table campaigns enable row level security;

create policy "Lectura pública de campañas"
  on campaigns for select
  using (true);

-- Esto también se puede crear desde el panel de Supabase:
-- Storage > Create a new bucket > nombre: animal-photos > Public bucket: sí
insert into storage.buckets (id, name, public)
values ('animal-photos', 'animal-photos', true)
on conflict (id) do nothing;

-- Bucket para las fotos de las campañas
insert into storage.buckets (id, name, public)
values ('campaign-photos', 'campaign-photos', true)
on conflict (id) do nothing;
