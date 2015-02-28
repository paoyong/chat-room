var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/:roomName', function(req, res, next) {
    res.render('room', { roomName: req.params.roomName });
});

module.exports = router;
