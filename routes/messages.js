var express = require('express');
var router = express.Router();
var db = require('../db.js');

router.get('/', function(req, res, next){
    if (req.query.chatroom && req.query.limit) {
        db.getMessages(req.query.chatroom, req.query.limit, function(err, rows) {
            if (err) {
                res.send(err);
            } else {
                res.send(rows);
            }
        });
    } else {
        res.send('Invalid URL: no chat room or limit specified! Example of good URL: /messages?chatroom=general&limit=10&timezoneoffsethours=5');
    }
});

module.exports = router;
