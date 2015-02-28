// router for /r/:room
// Also handles POST to room
var express = require('express');
var router = express.Router();
var chatdb = require('../db.js');

/* GET home page. */
router.get('/:roomName', function(req, res, next) {
    res.render('room', { roomName: req.params.roomName });
});

router.post('/:roomName', function(req, res, next) {
    
});
module.exports = router;
