import createError from 'http-errors';
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cookieSession from 'cookie-session';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import sessionsRouter from './routes/sessions.js';
import tokensRouter from './routes/tokens.js';

import passport from 'passport';
import flash from 'connect-flash';

import './initializers/passport';


import mongoose from 'mongoose';
mongoose.connect($1);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cookieSession({
  secret: 'jhfkjasghfiuw764i7kfjhsakjfhakh',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sessions', sessionsRouter);
app.use('/tokens', tokensRouter);

import apiRoute from './routes/api.js';
app.use('/api/v1.0/', apiRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
