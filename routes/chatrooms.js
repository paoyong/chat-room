var express = require('express');
var router = express.Router();
var db = require('../db.js');

router.get('/', function(req, res, next) {
    db.getChatRooms(function(err, rows) {
        if (err) {
            res.send(err);
        } else {
            res.send(rows);
        }
    });
});

// router.post('/insert', function(req, res, next) {
//     db.insertChatRoom(req.body.roomName, function(err) {
//         if (err) {
//             res.send(err);
//         } else {
//             res.send('Inserted new chat room into database.');
//         }
//     });
// });

module.exports = router;
