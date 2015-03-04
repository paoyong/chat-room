var config = require('./config.js');
var sqlite3 = require('sqlite3').verbose();
var pg = require('pg');
var chatdb = new sqlite3.Database(config.chat_db_filename);
var pgURL = config.pg_local_url;

function pgQuery(queryString, callback) {
    pg.connect(pgURL, function(err, client, done) {
        if (err) {
            callback(err);
        }
        client.query(queryString, function(err, result) {
            if (err) {
                return console.error('Error running query ', err);
            }
            callback(null, result);
            client.end();
        });
                
    });
}

module.exports = {
    insertMessage: function(chatRoom, username, message, callback) {
        var insertMessageQueryString = 'INSERT INTO message VALUES (\'' + chatRoom + '\',\'' + username + '\',\'' + message + '\', now())';
        console.log(insertMessageQueryString);
        pgQuery(insertMessageQueryString, function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    },
    getMessages: function(chatRoom, limit, callback) {
        var getMessagesQueryString = 'SELECT username, msg, to_char(time, \'HH:SS\') as time FROM message JOIN chat_room ON chat_room.room_name=message.room_name WHERE chat_room.room_name=\'' + chatRoom + '\'' + ' LIMIT ' + limit;
        pgQuery(getMessagesQueryString, function(err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result.rows);
            }
        });
    },
    getChatRooms: function(callback) {
        pgQuery('SELECT room_name FROM chat_room', function(err, result) {
            if (err) {
                callback(err);
            } else {
                callback(null, result.rows);
            }
        });
    }
};
