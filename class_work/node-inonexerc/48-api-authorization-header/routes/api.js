import express from 'express';
const router = express.Router();
import passport from 'passport';

router.use(passport.authenticate('jwt', { session: false }));

router.get('/whoami', function(req, res, next) {
    res.send(`Hello! ${req.user.email}`);
});

export default router;
