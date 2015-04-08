# Chatter
A minimal real-time chat application using socket.io and React.js.

Try opening two windows at the same time, and chat away!

## Stack
Frontend: React.js for databinding

Backend: PostgresQL, Node

## Server-Side Installation
Chatter relies heavily on postgresql, so correct setup for postgres is mandatory. For this application, I used postgres with username `postgres` and password `postgres`. Of course, these values are up to you, but I find that doing `postgres` for both makes it easy.

1. Set up postgresql connection string at config.js
2. Run `dbcommands.sql` with `psql -U postgres -a -f dbcommands.sql`.
3. Run `node app.js`.
