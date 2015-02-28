// router for /r/:room
// Also handles POST to room
var express = require('express');
var router = express.Router();
var chatdb = require('../db.js');

router.get('/:roomName', function(req, res, next) {
    res.render('room', { roomName: req.params.roomName });
});

// Might not be needed with socket.io!
router.post('/:roomName', function(req, res, next) {
    var body = req.body;
    chatdb.insertMessage(req.params.roomName, body.username, body.msg, body.time, function(err) {
        if (err) {
            console.log('Error inserting message: ' + err);
        }
    });
});
module.exports = router;
