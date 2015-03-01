// router for /r/:room
// Also handles POST to room
var express = require('express');
var router = express.Router();
var chatdb = require('../db.js');

router.get('/:roomName', function(req, res, next) {
    if (req.session.username === undefined) {
        res.redirect('/');
    }
    res.render('room', { roomName: req.params.roomName, username: req.session.username });
});

module.exports = router;
