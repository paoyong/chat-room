DROP DATABASE IF EXISTS chatter;
CREATE DATABASE chatter;
\connect chatter;

DROP TABLE IF EXISTS chat_room;

CREATE TABLE chat_room (
    room_name   VARCHAR(40),
    PRIMARY KEY(room_name)
);

CREATE TABLE message (
    id serial PRIMARY KEY,
    room_name VARCHAR(40) REFERENCES chat_room(room_name),
    username VARCHAR(40),
    msg TEXT,
    time TIMESTAMPTZ
);
