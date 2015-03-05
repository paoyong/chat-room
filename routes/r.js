// router for /r/:room
// Also handles POST to room
var express = require('express');
var router = express.Router();
var chatdb = require('../db.js');
var peopleOnline = {};

module.exports = function(io) {
    router.get('/:roomName', function(req, res, next) {
        var roomName = req.params.roomName;
        var username = req.session.username;

        if (username === undefined) {
            res.redirect('/');
        } else {
            if ((typeof peopleOnline[roomName]) === 'undefined') {
                console.log("UNDEFINED PEOPEL ONLINE");
                peopleOnline[roomName] = {onlineCount: 0, peopleOnline: []};
            }
            console.log(peopleOnline);
            peopleOnline[roomName].peopleOnline.push(username);
            peopleOnline[roomName].onlineCount++;

            res.render('room', {
                roomName: roomName, 
                username: username
            });
        }
    });

    router.get('/online/count', function(req, res, next) {
        res.send(peopleOnline);
    });

    router.get('/online/people', function(req, res, next) {
        if (!req.params.roomName) {
            res.send('Must use appropriate URL. Example: /r/online/people?roomName=general');
        } else {
            res.send(peopleOnline[req.params.roomName]);
        }
    });

    router.get('disconnect', function(req, res, next) {
        if (req.params.roomName && req.params.username) {
            res.send('Must use appropriate URL. Example: /r/online/people?roomName=general');
        } else {
            res.send(peopleOnline[req.params.roomName]);
        }
    });

    return router;
};
