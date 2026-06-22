-- Hetta Database Schema
-- Run this in Supabase SQL Editor (supabase.com → your project → SQL Editor → New Query)

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  role text not null default 'tenant' check (role in ('tenant', 'landlord', 'agent', 'admin')),
  phone text,
  whatsapp text,
  city text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Public profiles viewable" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'User'), coalesce(new.raw_user_meta_data->>'role', 'tenant'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Listings
create table public.listings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  property_type text not null check (property_type in ('Room', 'Flat', 'House')),
  bedrooms int not null default 1,
  price int not null,
  city text not null,
  area text not null,
  address text,
  available_from date default current_date,
  furnished text default 'Furnished' check (furnished in ('Furnished', 'Part furnished', 'Unfurnished')),
  features text[] default '{}',
  status text default 'active' check (status in ('active', 'pending', 'inactive')),
  images text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.listings enable row level security;
create policy "Listings are viewable by everyone" on public.listings for select using (status = 'active');
create policy "Users can view own listings" on public.listings for select using (auth.uid() = user_id);
create policy "Users can create listings" on public.listings for insert with check (auth.uid() = user_id);
create policy "Users can update own listings" on public.listings for update using (auth.uid() = user_id);
create policy "Users can delete own listings" on public.listings for delete using (auth.uid() = user_id);

-- Favourites
create table public.favourites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  listing_id uuid references public.listings(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, listing_id)
);

alter table public.favourites enable row level security;
create policy "Users can view own favourites" on public.favourites for select using (auth.uid() = user_id);
create policy "Users can add favourites" on public.favourites for insert with check (auth.uid() = user_id);
create policy "Users can remove favourites" on public.favourites for delete using (auth.uid() = user_id);

-- Enquiries (messages between tenant and landlord)
create table public.enquiries (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references public.listings(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  recipient_id uuid references public.profiles(id) on delete cascade not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

alter table public.enquiries enable row level security;
create policy "Users can view own enquiries" on public.enquiries for select using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "Users can send enquiries" on public.enquiries for insert with check (auth.uid() = sender_id);
create policy "Recipients can mark as read" on public.enquiries for update using (auth.uid() = recipient_id);

-- Storage bucket for listing images
insert into storage.buckets (id, name, public) values ('listing-images', 'listing-images', true);

create policy "Anyone can view listing images" on storage.objects for select using (bucket_id = 'listing-images');
create policy "Authenticated users can upload images" on storage.objects for insert with check (bucket_id = 'listing-images' and auth.role() = 'authenticated');
create policy "Users can delete own images" on storage.objects for delete using (bucket_id = 'listing-images' and auth.uid()::text = (storage.foldername(name))[1]);

-- Indexes for performance
create index listings_city_idx on public.listings(city);
create index listings_type_idx on public.listings(property_type);
create index listings_status_idx on public.listings(status);
create index listings_user_idx on public.listings(user_id);
create index enquiries_recipient_idx on public.enquiries(recipient_id);
create index favourites_user_idx on public.favourites(user_id);
