import express from 'express';
const router = express.Router();
import User from '../models/user.js';

/* GET home page. */
router.get('/', async function(req, res, next) {

  let currentUser = null;
  if (req.session.userid) {
    currentUser = await User.findById(req.session.userid);
  }

  res.render('index', { title: 'Express', user: currentUser });
});

export default router;
