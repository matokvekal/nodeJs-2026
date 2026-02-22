import express from 'express';
const router = express.Router();
import User from '../models/user.js';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', user: req.user });
});

export default router;
