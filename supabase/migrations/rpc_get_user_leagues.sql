CREATE OR REPLACE FUNCTION get_user_leagues(p_user_id UUID)
RETURNS TABLE (id UUID, name TEXT) AS $$
BEGIN
  RETURN QUERY
  -- Distinct is important to avoid returning the same league multiple times
  SELECT DISTINCT l.id, l.name
  FROM leagues l
  -- Join to find leagues where the user is a DT of a team
  LEFT JOIN teams t_dt ON l.id = t_dt.league_id AND t_dt.dt_id = p_user_id
  -- Join to find leagues where the user is a member of a team
  LEFT JOIN teams t_member ON l.id = t_member.league_id
  LEFT JOIN team_members tm ON t_member.id = tm.team_id AND tm.player_id = p_user_id
  -- The user is part of the league if either of the joins found a match
  WHERE t_dt.id IS NOT NULL OR tm.team_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql;
