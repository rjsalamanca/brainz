CREATE DATABASE brainz;

CREATE TABLE users(
    id SERIAL PRIMARY KEY, 
    f_name varchar(100),
    l_name varchar(100),
    email varchar(500),
    password varchar(500)
);

CREATE TABLE game_modes(
    id SERIAL PRIMARY KEY, 
    difficulty varchar(50),
    mode varchar(50)
);

CREATE TABLE scores(
    id SERIAL PRIMARY KEY,
    accuracy FLOAT,
    points INT,
    user_id INT REFERENCES users(id),
    game_mode_id INT REFERENCES game_modes(id)
);