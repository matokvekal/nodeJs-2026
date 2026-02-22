import express from 'express';
const router = express.Router();
import User from '../models/user.js';

/* GET home page. */
router.get('/', async function(req, res, next) {
  let user = null;
  if (req.session.userid) {
    user = await User.findById(req.session.userid);
  }

  res.render('index', { title: 'Express', user: user });
});

export default router;
