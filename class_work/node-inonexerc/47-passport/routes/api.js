import express from 'express';
import passport from 'passport';
const router = express.Router();
import createError from 'http-errors';

router.get('/whoami', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    if (req.user) {
        res.send({ email: req.user.email });
    } else {
        next(createError(400));        
    }
});

export default router;