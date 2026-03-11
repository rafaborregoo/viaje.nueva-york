create extension if not exists pgcrypto;

create or replace function public.is_allowed_trip_user()
returns boolean
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) in (
    'noemiparadagirona@gmail.com',
    'borregorafa99@gmail.com'
  );
$$;

create table if not exists public.trip_items (
  id uuid primary key default gen_random_uuid(),
  item_type text not null,
  title text not null,
  notes text null,
  link text null,
  created_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.trip_files (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.trip_items(id) on delete cascade,
  original_name text not null,
  mime_type text not null default 'application/octet-stream',
  size_bytes bigint not null default 0,
  storage_path text not null unique,
  created_by uuid null references auth.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists trip_items_created_at_idx on public.trip_items(created_at desc);
create index if not exists trip_files_item_id_idx on public.trip_files(item_id);

alter table public.trip_items enable row level security;
alter table public.trip_files enable row level security;

drop policy if exists "Authenticated users can read trip items" on public.trip_items;
create policy "Authenticated users can read trip items"
on public.trip_items
for select
to authenticated
using (public.is_allowed_trip_user());

drop policy if exists "Authenticated users can insert trip items" on public.trip_items;
create policy "Authenticated users can insert trip items"
on public.trip_items
for insert
to authenticated
with check (auth.uid() is not null and public.is_allowed_trip_user());

drop policy if exists "Authenticated users can update trip items" on public.trip_items;
create policy "Authenticated users can update trip items"
on public.trip_items
for update
to authenticated
using (public.is_allowed_trip_user())
with check (auth.uid() is not null and public.is_allowed_trip_user());

drop policy if exists "Authenticated users can delete trip items" on public.trip_items;
create policy "Authenticated users can delete trip items"
on public.trip_items
for delete
to authenticated
using (public.is_allowed_trip_user());

drop policy if exists "Authenticated users can read trip files" on public.trip_files;
create policy "Authenticated users can read trip files"
on public.trip_files
for select
to authenticated
using (public.is_allowed_trip_user());

drop policy if exists "Authenticated users can insert trip files" on public.trip_files;
create policy "Authenticated users can insert trip files"
on public.trip_files
for insert
to authenticated
with check (auth.uid() is not null and public.is_allowed_trip_user());

drop policy if exists "Authenticated users can update trip files" on public.trip_files;
create policy "Authenticated users can update trip files"
on public.trip_files
for update
to authenticated
using (public.is_allowed_trip_user())
with check (auth.uid() is not null and public.is_allowed_trip_user());

drop policy if exists "Authenticated users can delete trip files" on public.trip_files;
create policy "Authenticated users can delete trip files"
on public.trip_files
for delete
to authenticated
using (public.is_allowed_trip_user());

insert into storage.buckets (id, name, public, file_size_limit)
values ('trip-docs', 'trip-docs', false, 15728640)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit;

drop policy if exists "Authenticated users can read trip-docs" on storage.objects;
create policy "Authenticated users can read trip-docs"
on storage.objects
for select
to authenticated
using (bucket_id = 'trip-docs' and public.is_allowed_trip_user());

drop policy if exists "Authenticated users can upload trip-docs" on storage.objects;
create policy "Authenticated users can upload trip-docs"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'trip-docs' and public.is_allowed_trip_user());

drop policy if exists "Authenticated users can update trip-docs" on storage.objects;
create policy "Authenticated users can update trip-docs"
on storage.objects
for update
to authenticated
using (bucket_id = 'trip-docs' and public.is_allowed_trip_user())
with check (bucket_id = 'trip-docs' and public.is_allowed_trip_user());

drop policy if exists "Authenticated users can delete trip-docs" on storage.objects;
create policy "Authenticated users can delete trip-docs"
on storage.objects
for delete
to authenticated
using (bucket_id = 'trip-docs' and public.is_allowed_trip_user());
