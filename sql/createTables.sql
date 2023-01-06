DROP TABLE IF EXISTS pastes;

CREATE TABLE  pastes (
    id          serial PRIMARY KEY,
    title       text,
    body text NOT NULL
);

CREATE TABLE  comments (
    comment_id          serial PRIMARY KEY,
    paste_id       int,
    comment text NOT NULL,
    username text NOT NULL,
    FOREIGN KEY (paste_id) REFERENCES pastes(id)

);