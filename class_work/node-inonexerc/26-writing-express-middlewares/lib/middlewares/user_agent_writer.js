import fs from 'fs';
const log = fs.createWriteStream('./useragents.log', {
    flags: 'a',
});

const seen = {};

export default function(req, res, next) {
    const ua = req.get('User-Agent');
    log.write(ua);

    seen[ua] = seen[ua] || 0;
    seen[ua]++;
    res.locals.seenUserAgents = seen;

    next();
}