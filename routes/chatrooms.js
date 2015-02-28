var express = require('express');
var router = express.Router();
var db = require('../db.js');

router.get('/', function(req, res, next){
    db.getChatRooms(function(err, rows) {
        res.send(rows);
    });
});

module.exports = router;
