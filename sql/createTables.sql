DROP TABLE IF EXISTS pastes;

CREATE TABLE  pastes (
    id          serial PRIMARY KEY,
    title       text,
    body text NOT NULL
);