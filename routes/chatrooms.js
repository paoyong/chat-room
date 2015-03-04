var express = require('express');
var router = express.Router();
var db = require('../db.js');

router.get('/', function(req, res, next){
    db.getChatRooms(function(err, rows) {
        if (err) {
            res.send(err);
        } else {
            res.send(rows);
        }
    });
});

module.exports = router;
