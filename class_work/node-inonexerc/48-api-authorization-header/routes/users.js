import express from 'express';
const router = express.Router();
import User from '../models/user.js';

/* GET users listing. */
router.get('/new', function(req, res, next) {
  res.render('users/new', { user: new User() });
});

router.post('/', async function(req, res, next) {
  const user = new User(req.body);
  try {
    await user.save();
  } catch (err) {
    return res.render('users/new', { user: user });
  }
  res.redirect('/');  
});

export default router;
