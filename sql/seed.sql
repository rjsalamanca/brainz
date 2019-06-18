INSERT INTO users
    (f_name, l_name, email, password)
VALUES
    ('Anonymous Zombie', 'Rob', 'zombie@horde', '1');

INSERT INTO game_modes
    (difficulty,mode)
VALUES
    ('easy','regular'),
    ('medium','regular'),
    ('hard','regular'),
    ('apocalypse','regular'),
    ('easy','flick'),
    ('medium','flick'),
    ('hard','flick');

INSERT INTO scores
    (accuracy, points, user_id, game_mode_id)
VALUES
    (90.3, 100, 1,1);

INSERT INTO kills
    (kill_count, user_id)
VALUES
    (0,1);