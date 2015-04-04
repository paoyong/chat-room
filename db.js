var config = require('./config.js');
var pg = require('pg');

// Change to config.pg_local_url if working on local
var pgURL = config.pg_server_url;
// var pgURL = config.pg_local_url;

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
    insertMessage: function(chatRoom, username, message, unix_time, callback) {
        var insertMessageQueryString = 'INSERT INTO message VALUES (DEFAULT, \'' + chatRoom + '\',\'' + username + '\',\'' + message + '\', to_timestamp(' + unix_time + '))';
        pgQuery(insertMessageQueryString, function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    },
    insertChatRoom: function(chatRoomName, callback) {
        var insertChatRoomQueryString = 'INSERT INTO chat_room VALUES (\'' + chatRoomName + '\')';
        pgQuery(insertChatRoomQueryString, function(err) {
            if (err) {
                callback(err);
            } else {
                callback(null);
            }
        });
    },
    getMessages: function(chatRoom, limit, callback) {
        // No need for time zone conversion!
        var getMessagesQueryString = 'SELECT username, msg, to_char(time, \'HH24:MI\') as time FROM message JOIN chat_room ON chat_room.room_name=message.room_name WHERE chat_room.room_name=\'' + chatRoom + '\'' + ' LIMIT ' + limit;

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
