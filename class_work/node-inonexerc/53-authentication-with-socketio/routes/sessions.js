import express from 'express';
const router = express.Router();
import passport from 'passport';
import User from '../models/user.js';
import socketio from '../liveupdate.js';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('sessions/new', { error: req.flash('error') });
});

router.post('/',
    passport.authenticate('local'),
    function(req, res, next) {
        console.log('new user connected');
        socketio.io.sockets.emit('msg', `New user connected: ${req.user.email}`);
        res.redirect('/');
    }
);

router.post('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

export default router;

