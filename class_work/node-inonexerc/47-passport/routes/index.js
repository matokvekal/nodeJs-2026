import express from 'express';
const router = express.Router();
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index', { title: 'Express', user: req.user });
});

router.get('/token', function(req, res, next) {
  res.render('token', { token: null });
});

router.post('/token', function(req, res, next) {
  if (req.user) {
    const token = jwt.sign(
      { id: req.user.id },
      'secret123',
      { expiresIn: '7d' }
    );
    res.render('token', { token });
  }
});

export default router;
