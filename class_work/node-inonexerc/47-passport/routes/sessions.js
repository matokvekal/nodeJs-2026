import express from 'express';
const router = express.Router();
import passport from 'passport';
import User from '../models/user.js';

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('sessions/new', { error: req.flash('error') });
});

router.post('/',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/sessions',
        failureFlash: true
    })
);

router.post('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

export default router;

