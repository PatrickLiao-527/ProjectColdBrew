-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create users table
create table users (
  id uuid default uuid_generate_v4() primary key,
  name varchar not null,
  email varchar unique not null,
  linkedin_url varchar,
  resume_url text,
  password text not null,
  role varchar check (role in ('mentor', 'mentee')) not null,
  school varchar,
  graduation_year integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create mentee_profiles table
create table mentee_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  rating_avg float default 0,
  rating_count integer default 0,
  interests text,
  looking_for text,
  intro text,
  preferred_companies text,
  preferred_roles text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create mentor_profiles table
create table mentor_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  title varchar,
  industry varchar,
  company varchar,
  position varchar,
  years_experience integer,
  tags text,
  bio text,
  rating_avg float default 0,
  rating_count integer default 0,
  status varchar check (status in ('pending', 'approved', 'rejected')) default 'pending',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create coffee_chats table
create table coffee_chats (
  id uuid default uuid_generate_v4() primary key,
  mentee_id uuid references users(id) on delete cascade not null,
  mentor_id uuid references users(id) on delete cascade not null,
  status varchar check (status in ('Scheduled', 'Canceled', 'Finished')) not null,
  scheduled_time timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create bids table
create table bids (
  id uuid default uuid_generate_v4() primary key,
  coffee_chat_id uuid references coffee_chats(id) on delete cascade not null,
  amount_beans integer not null,
  status varchar check (status in ('active', 'rejected', 'expired')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create ratings table
create table ratings (
  id uuid default uuid_generate_v4() primary key,
  coffee_chat_id uuid references coffee_chats(id) on delete cascade not null,
  from_user_id uuid references users(id) on delete cascade not null,
  to_user_id uuid references users(id) on delete cascade not null,
  score integer check (score >= 1 and score <= 5) not null,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create wallets table
create table wallets (
  user_id uuid primary key references users(id) on delete cascade,
  balance integer default 0 not null
);

-- Create wallet_transactions table
create table wallet_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade not null,
  amount integer not null,
  type varchar check (type in ('topup', 'spend', 'reward')) not null,
  related_to uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table users enable row level security;
alter table mentee_profiles enable row level security;
alter table mentor_profiles enable row level security;
alter table coffee_chats enable row level security;
alter table bids enable row level security;
alter table ratings enable row level security;
alter table wallets enable row level security;
alter table wallet_transactions enable row level security;

-- Create RLS policies
-- Users can view their own profile and public profiles
create policy "Users can view their own profile"
  on users for select
  using (auth.uid() = id);

create policy "Users can view public profiles"
  on users for select
  using (true);

-- Users can update their own profile
create policy "Users can update their own profile"
  on users for update
  using (auth.uid() = id);

-- Mentee profiles policies
create policy "Users can view mentee profiles"
  on mentee_profiles for select
  using (true);

create policy "Users can update their own mentee profile"
  on mentee_profiles for update
  using (auth.uid() = user_id);

-- Mentor profiles policies
create policy "Users can view mentor profiles"
  on mentor_profiles for select
  using (true);

create policy "Users can update their own mentor profile"
  on mentor_profiles for update
  using (auth.uid() = user_id);

-- Coffee chats policies
create policy "Users can view their own coffee chats"
  on coffee_chats for select
  using (auth.uid() = mentee_id or auth.uid() = mentor_id);

create policy "Users can create coffee chats"
  on coffee_chats for insert
  with check (auth.uid() = mentee_id);

create policy "Users can update their own coffee chats"
  on coffee_chats for update
  using (auth.uid() = mentee_id or auth.uid() = mentor_id);

-- Bids policies
create policy "Users can view bids for their coffee chats"
  on bids for select
  using (
    exists (
      select 1 from coffee_chats
      where coffee_chats.id = bids.coffee_chat_id
      and (coffee_chats.mentee_id = auth.uid() or coffee_chats.mentor_id = auth.uid())
    )
  );

create policy "Users can create bids for their coffee chats"
  on bids for insert
  with check (
    exists (
      select 1 from coffee_chats
      where coffee_chats.id = bids.coffee_chat_id
      and coffee_chats.mentee_id = auth.uid()
    )
  );

-- Ratings policies
create policy "Users can view ratings for their coffee chats"
  on ratings for select
  using (
    exists (
      select 1 from coffee_chats
      where coffee_chats.id = ratings.coffee_chat_id
      and (coffee_chats.mentee_id = auth.uid() or coffee_chats.mentor_id = auth.uid())
    )
  );

create policy "Users can create ratings for their coffee chats"
  on ratings for insert
  with check (
    exists (
      select 1 from coffee_chats
      where coffee_chats.id = ratings.coffee_chat_id
      and (coffee_chats.mentee_id = auth.uid() or coffee_chats.mentor_id = auth.uid())
    )
  );

-- Wallet policies
create policy "Users can view their own wallet"
  on wallets for select
  using (auth.uid() = user_id);

create policy "Users can update their own wallet"
  on wallets for update
  using (auth.uid() = user_id);

-- Wallet transactions policies
create policy "Users can view their own transactions"
  on wallet_transactions for select
  using (auth.uid() = user_id);

create policy "Users can create their own transactions"
  on wallet_transactions for insert
  with check (auth.uid() = user_id); 