import express from 'express';
const router = express.Router();
import Dig from '../lib/dig.js';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/dig', async function(req, res, next) {
  const dig = new Dig();
  const { url, username } = req.body;
  await dig.dig(url, username);
  res.sendStatus(201);
});

router.get('/dig', async function(req, res, next) {
  const dig = new Dig();
  const data = dig.list();
  res.send(data);
});

export default router;
