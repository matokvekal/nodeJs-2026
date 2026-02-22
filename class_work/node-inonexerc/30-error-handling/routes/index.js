import express from 'express';
const router = express.Router();
import createError from 'http-errors';
import fs from 'fs';

/* GET home page. */
router.get('/', function(req, res, next) {
  setTimeout(
    function() {
      return next(createError('baaa'));
    }, 0);
});

router.get('/file', function(req, res, next) {
  fs.readFile('C:/Windows/win.ini', 'utf8', (err, data) => {
    if (err) return next(err);
    res.send(data);
  })
});

export default router;
