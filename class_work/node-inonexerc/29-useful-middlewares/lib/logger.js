import winston from 'winston';

winston.configure({
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({ filename: 'log/app.log'}),
    ]
});

if (process.env['NODE_ENV'] !== 'production') {
    winston.add(new winston.transports.Console());
}

export default winston;
