-- This script requires manual insertion of users in Supabase Auth first.
-- Get the UUIDs from the auth.users table and replace them below.

-- MOCK DATA SCRIPT

-- 1. Insert Mock Profiles
-- Replace UUIDs with actual auth.users IDs
INSERT INTO profiles (id, username, full_name, role) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'carlos_dt', 'Carlos Rodriguez', 'dt'),
('b2c3d4e5-f6a7-8901-2345-67890abcdef0', 'laura_dt', 'Laura Gomez', 'dt'),
('c3d4e5f6-a7b8-9012-3456-7890abcdef01', 'javier_player', 'Javier Lopez', 'player'),
('d4e5f6a7-b8c9-0123-4567-890abcdef012', 'ana_player', 'Ana Torres', 'player');

-- 2. Insert a Mock League
-- Let's assume carlos_dt is the owner of the league
INSERT INTO leagues (id, name, owner_id) VALUES
('1a2b3c4d-5e6f-7890-1234-567890abcdef', 'Liga de Leyendas', 'a1b2c3d4-e5f6-7890-1234-567890abcdef');

-- 3. Insert Mock Teams
INSERT INTO teams (id, name, league_id, dt_id) VALUES
('t1e2a3m-4f5f-6a7b-8c9d-0e1f2a3b4c5d', 'Titanes del Ring', '1a2b3c4d-5e6f-7890-1234-567890abcdef', 'a1b2c3d4-e5f6-7890-1234-567890abcdef'),
('t2e3a4m-5f6f-7a8b-9c0d-1e2f3a4b5c6d', 'Gladiadores del Gol', '1a2b3c4d-5e6f-7890-1234-567890abcdef', 'b2c3d4e5-f6a7-8901-2345-67890abcdef0');

-- 4. Assign Players to Teams
INSERT INTO team_members (team_id, player_id) VALUES
('t1e2a3m-4f5f-6a7b-8c9d-0e1f2a3b4c5d', 'c3d4e5f6-a7b8-9012-3456-7890abcdef01'),
('t2e3a4m-5f6f-7a8b-9c0d-1e2f3a4b5c6d', 'd4e5f6a7-b8c9-0123-4567-890abcdef012');

-- 5. Insert a Completed Mock Match
INSERT INTO matches (id, league_id, team1_id, team2_id, match_date, status, team1_score, team2_score, mvp_player_id) VALUES
('m1a2t3c-h4e5-f6a7-b8c9-d0e1f2a3b4c5', '1a2b3c4d-5e6f-7890-1234-567890abcdef', 't1e2a3m-4f5f-6a7b-8c9d-0e1f2a3b4c5d', 't2e3a4m-5f6f-7a8b-9c0d-1e2f3a4b5c6d', '2024-05-20 19:00:00+00', 'completed', 3, 1, 'c3d4e5f6-a7b8-9012-3456-7890abcdef01');

-- 6. Insert Mock Match Events
-- Match ID: m1a2t3c-h4e5-f6a7-b8c9-d0e1f2a3b4c5
-- Team 1 (Titanes): t1e2a3m-4f5f-6a7b-8c9d-0e1f2a3b4c5d, Player (Javier): c3d4e5f6-a7b8-9012-3456-7890abcdef01
-- Team 2 (Gladiadores): t2e3a4m-5f6f-7a8b-9c0d-1e2f3a4b5c6d, Player (Ana): d4e5f6a7-b8c9-0123-4567-890abcdef012

-- Javier (Titanes) scores at 15'
INSERT INTO match_events (match_id, player_id, team_id, event_type, event_time) VALUES
('m1a2t3c-h4e5-f6a7-b8c9-d0e1f2a3b4c5', 'c3d4e5f6-a7b8-9012-3456-7890abcdef01', 't1e2a3m-4f5f-6a7b-8c9d-0e1f2a3b4c5d', 'goal', 15);

-- Ana (Gladiadores) scores at 30'
INSERT INTO match_events (match_id, player_id, team_id, event_type, event_time) VALUES
('m1a2t3c-h4e5-f6a7-b8c9-d0e1f2a3b4c5', 'd4e5f6a7-b8c9-0123-4567-890abcdef012', 't2e3a4m-5f6f-7a8b-9c0d-1e2f3a4b5c6d', 'goal', 30);

-- Javier (Titanes) scores again at 55'
INSERT INTO match_events (match_id, player_id, team_id, event_type, event_time) VALUES
('m1a2t3c-h4e5-f6a7-b8c9-d0e1f2a3b4c5', 'c3d4e5f6-a7b8-9012-3456-7890abcdef01', 't1e2a3m-4f5f-6a7b-8c9d-0e1f2a3b4c5d', 'goal', 55);

-- Javier (Titanes) scores a hat-trick at 80'
INSERT INTO match_events (match_id, player_id, team_id, event_type, event_time) VALUES
('m1a2t3c-h4e5-f6a7-b8c9-d0e1f2a3b4c5', 'c3d4e5f6-a7b8-9012-3456-7890abcdef01', 't1e2a3m-4f5f-6a7b-8c9d-0e1f2a3b4c5d', 'goal', 80);
