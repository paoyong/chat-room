var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var currUser = req.session.username;
    var renderData = {
        title: 'Chat Room',
        loginMessage: 'Logged in as ',
        loggedIn: currUser
    }
    if (currUser === undefined) {
        renderData.loginMessage = 'Please set a username.';
    }
    res.render('index', renderData);
});

router.post('/login', function(req, res, next) {
    req.session.username = req.body.username;
    console.log(req.session);
    res.end('done');
});

router.get('/login', function(req, res, next) {
    res.send(req.session.username);
})

module.exports = router;

