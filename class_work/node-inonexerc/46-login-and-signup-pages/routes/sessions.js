import express from 'express';
const router = express.Router();
import User from '../models/user.js';

// GET /sessions/new
router.get('/new', function (req, res, next) {
    res.render('sessions/new', { user: new User() });
});

// POST /sessions
router.post('/', async function(req, res, next) {
    let user = new User();
    try {
        user = await User.findOne({ email: req.body.email });
        const res = await user.checkPassword(req.body.password);
        if (!res) {
            throw new Error('Invalid password');
        }
    } catch (err) {
      return res.render('sessions/new', { user: user, error: 'Invalid email or password' });
    }
    req.session.userid = user.id;
    res.redirect('/');  
});

export default router;