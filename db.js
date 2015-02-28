var config = require('./config.js');
var sqlite3 = require('sqlite3').verbose();
var chatdb = new sqlite3.Database(config.chat_db_filename);

module.exports = {
    insertMessage: function(chatRoom, username, message, unixTime, callback) {
        chatdb.serialize(function() {
            chatdb.run('INSERT INTO message VALUES ($chatroom, $message, $user, $unix_time )', {
                $chatroom: chatRoom,
                $message: message,
                $user: username,
                $unix_time: unixTime
            }, function(err) {
                if (err) {
                    callback(err);
                }
            });
        });
    },
    getMessages: function(chatRoom, limit, callback) {
        chatdb.serialize(function() {
            chatdb.all('SELECT message.msg, message.user, message.unix_time FROM message JOIN chat_room ON chat_room.name=message.room_name WHERE chat_room.name=\'' + chatRoom + '\'' + ' LIMIT ' + limit, function(err, rows){
                if (err) {
                    console.log('Error while grabbing messages: ' + err);
                } else {
                    callback(null, rows);
                }
            });
        });
    },
    getChatRooms: function(callback) {
        chatdb.serialize(function() {
            chatdb.all('SELECT name FROM chat_room', function(err, rows) {
                if (err) {
                    console.log('Error while grabbing chat rooms: ' + err);
                } else {
                    callback(null, rows);
                }
            });
        });
    }
};
