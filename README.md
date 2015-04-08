# Chatter
A minimal real-time chat application using socket.io and React.js.

Try opening two windows at the same time, and chat away!

## Stack
Frontend: React.js for databinding, socket.io for POST stuff

Backend: PostgresQL, Node, socket.io for GET stuff

In this case, socket.io replaces the classical ajax POST get for a new chat message. This allows for real time chatting.

Socket.io talks between frontend and backend. Whenever someone sends a chat message, React.js handles that message, and emits a socket message which the server recieves. The server then adds the socket message into the database.

## Server-Side Installation
Chatter relies heavily on postgresql, so correct setup for postgres is mandatory. For this application, I used postgres with username `postgres` and password `postgres`. You can choose to roll with a diffent username, but I find that doing `postgres` for both makes it simple.

1. Set up postgresql connection string at config.js
2. Run `dbcommands.sql` with the bash command 

```
psql -U postgres -a -f dbcommands.sql
``` 

3. If using a different postgresql username and/or password, update `config.js` accordingly.

4. Run `node app.js`, or use `pm2`/`forever` to run it in the background on a server.
