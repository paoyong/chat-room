create table chat_room (
    room_name   varchar(40),
    primary key(room_name)
);

create table message (room_name varchar(40) references chat_room(room_name), username varchar(40), msg text, unix_time timestamp);
