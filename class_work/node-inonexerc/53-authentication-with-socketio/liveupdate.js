import User from './models/user.js';
import socketio from 'socket.io';
const session = require('cookie-session')({
    name: 'session',
    secret: 'ninja',
});

function init(server) {
    const io = socketio(server);
    init.io = io;

    io.on('connection', socket => {
        let cookieString = socket.request.headers.cookie;

        let req = { connection: { encrypted: false }, headers: { cookie: cookieString } };
        let res = { getHeader: () => { }, setHeader: () => { } };

        session(req, res, () => {
            console.log('111');
            if (req.session && req.session.passport && req.session.passport.user) {
                console.log('222');
                const user = User.findById(req.session.passport.user, function(err, user) {
                    if (err) return socket.disconnect();
                });
            } else {
                console.log('--- 2 user not authenticatetd, bye bye');
                socket.disconnect();
            }
            console.log('333');
        });
    })
}

export default init;