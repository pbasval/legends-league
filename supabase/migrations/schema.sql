-- Create custom types (ENUMs) for structured data
CREATE TYPE user_role AS ENUM ('super_admin', 'dt', 'captain', 'player');
CREATE TYPE team_role AS ENUM ('captain', 'player');
CREATE TYPE match_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE event_type AS ENUM ('goal', 'assist', 'yellow_card', 'red_card');
CREATE TYPE attendance_status AS ENUM ('confirmed', 'denied');

-- Profiles Table: Extends Supabase's auth.users with app-specific data
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'player',
  player_rating FLOAT NOT NULL DEFAULT 800.0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leagues Table: For multi-tenancy
CREATE TABLE leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams Table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  shield_url TEXT,
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  elo_rating INT NOT NULL DEFAULT 1000,
  dt_id UUID NOT NULL REFERENCES profiles(id)
);

-- Team Members Junction Table
CREATE TABLE team_members (
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_in_team team_role NOT NULL DEFAULT 'player',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (team_id, player_id)
);

-- Matches Table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  team1_id UUID NOT NULL REFERENCES teams(id),
  team2_id UUID NOT NULL REFERENCES teams(id),
  match_date TIMESTAMPTZ,
  status match_status NOT NULL DEFAULT 'scheduled',
  team1_score INT DEFAULT 0,
  team2_score INT DEFAULT 0,
  elo_change_team1 INT,
  elo_change_team2 INT,
  mvp_player_id UUID REFERENCES profiles(id),
  recap_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Match Events Table
CREATE TABLE match_events (
  id BIGSERIAL PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES profiles(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  event_type event_type NOT NULL,
  event_time INT -- Represents the minute of the match
);

-- Match Attendance Table
CREATE TABLE match_attendance (
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status attendance_status NOT NULL,
  PRIMARY KEY (match_id, player_id)
);

-- Enable Row Level Security for all created tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_attendance ENABLE ROW LEVEL SECURITY;
