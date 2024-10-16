create table public.users (
  id uuid not null primary key,
  email text,
  first_name text,
  last_name text,
  role text,
  photo text,
  created_at TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);
comment on table public.users is 'Profile data for each user.';
comment on column public.users.id is 'References the internal Supabase Auth user.';