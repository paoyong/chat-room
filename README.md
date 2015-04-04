# Chatter
A minimal real-time chat application using socket.io and React.js.

Try opening two windows at the same time, and chat away!

## Stack
Frontend: Jade, CSS, React.js for databinding
Backend: PostgresQL, Node.jsr

## Server-Side Installation
1. Set up postgresql connection string at config.js
2. Run `dbcommands.sql` with `psql -U postgres -a -f dbcommands.sql`.
3. Run `node app.js`.