-- Halaq — Supabase Schema
-- Ephemeral rooms. No user PII stored.
-- Run this in your Supabase SQL editor.

create table rooms (
  id          uuid primary key default gen_random_uuid(),
  code        text unique not null,
  host_id     text not null,
  surah_id    int,
  juz_number  int,
  status      text default 'lobby',
  created_at  timestamptz default now()
);

create table participants (
  id            uuid primary key default gen_random_uuid(),
  room_id       uuid references rooms(id) on delete cascade,
  user_sub      text not null,
  display_name  text not null,
  turn_order    int not null,
  ayahs_read    int default 0,
  joined_at     timestamptz default now()
);

create table turn_state (
  room_id         uuid primary key references rooms(id) on delete cascade,
  current_ayah    int not null default 1,
  current_turn    uuid references participants(id),
  audio_played    boolean default false,
  updated_at      timestamptz default now()
);

-- Enable RLS
alter table rooms enable row level security;
alter table participants enable row level security;
alter table turn_state enable row level security;

-- Allow all operations for now (tighten for production)
create policy "allow_all_rooms" on rooms for all using (true) with check (true);
create policy "allow_all_participants" on participants for all using (true) with check (true);
create policy "allow_all_turn_state" on turn_state for all using (true) with check (true);

-- Enable Realtime on turn_state (also enable in Supabase dashboard under Database > Replication)
alter publication supabase_realtime add table turn_state;
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table participants;

-- Auto-cleanup: rooms older than 24h (requires pg_cron extension, enable in Supabase dashboard)
-- select cron.schedule('cleanup-old-rooms', '0 * * * *', $$
--   delete from rooms where created_at < now() - interval '24 hours';
-- $$);
