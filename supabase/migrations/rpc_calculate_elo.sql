-- DB Function to Calculate ELO and update stats post-match
CREATE OR REPLACE FUNCTION calculate_elo_and_stats(p_match_id UUID)
RETURNS VOID AS $$
DECLARE
    v_team1_id UUID;
    v_team2_id UUID;
    v_team1_score INT;
    v_team2_score INT;
    v_team1_elo INT;
    v_team2_elo INT;
    v_expected_score1 FLOAT;
    v_expected_score2 FLOAT;
    v_actual_score1 FLOAT;
    v_actual_score2 FLOAT;
    v_new_elo1 INT;
    v_new_elo2 INT;
    v_elo_change INT;
    K_FACTOR CONSTANT INT := 32;
BEGIN
    -- 1. Get match details
    SELECT team1_id, team2_id, team1_score, team2_score
    INTO v_team1_id, v_team2_id, v_team1_score, v_team2_score
    FROM matches
    WHERE id = p_match_id;

    -- 2. Get current ELO ratings of the teams
    SELECT elo_rating INTO v_team1_elo FROM teams WHERE id = v_team1_id;
    SELECT elo_rating INTO v_team2_elo FROM teams WHERE id = v_team2_id;

    -- 3. Calculate expected scores
    v_expected_score1 := 1.0 / (1.0 + POWER(10, (v_team2_elo - v_team1_elo) / 400.0));
    v_expected_score2 := 1.0 / (1.0 + POWER(10, (v_team1_elo - v_team2_elo) / 400.0));

    -- 4. Determine actual scores
    IF v_team1_score > v_team2_score THEN
        v_actual_score1 := 1.0;
        v_actual_score2 := 0.0;
    ELSIF v_team2_score > v_team1_score THEN
        v_actual_score1 := 0.0;
        v_actual_score2 := 1.0;
    ELSE
        v_actual_score1 := 0.5;
        v_actual_score2 := 0.5;
    END IF;

    -- 5. Calculate ELO change
    v_elo_change := ROUND(K_FACTOR * (v_actual_score1 - v_expected_score1));

    v_new_elo1 := v_team1_elo + v_elo_change;
    v_new_elo2 := v_team2_elo - v_elo_change;

    -- 6. Update team ELO ratings
    UPDATE teams SET elo_rating = v_new_elo1 WHERE id = v_team1_id;
    UPDATE teams SET elo_rating = v_new_elo2 WHERE id = v_team2_id;

    -- 7. Store ELO change in the matches table for history
    UPDATE matches
    SET elo_change_team1 = v_elo_change,
        elo_change_team2 = -v_elo_change
    WHERE id = p_match_id;

END;
$$ LANGUAGE plpgsql;
