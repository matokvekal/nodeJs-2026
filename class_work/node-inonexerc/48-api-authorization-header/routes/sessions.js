import express from 'express';
const router = express.Router();
import User from '../models/user.js';
import passport from 'passport';

// GET /sessions/new
router.get('/new', function (req, res, next) {
    res.render('sessions/new', { error: req.flash('error') });
});

router.post('/', passport.authenticate(
    'local',
    {
        successRedirect: '/',
        failureRedirect: '/sessions/new',
        failureFlash: true,
    }
));

export default router;