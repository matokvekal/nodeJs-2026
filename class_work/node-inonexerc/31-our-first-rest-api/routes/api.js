import express from 'express';
const router = express.Router();

const messages = [
    { from: 'ynon', text: 'hello world'},
];

router.get('/messages', function(req, res, next) {
    res.send(messages);
});

router.post('/messages', function(req, res, next) {
    console.log(req.body);
    const from = req.body.from;
    const text = req.body.text;
    const msg = { from, text };
    messages.push(msg);
    res.send(msg);
});

export default router;

