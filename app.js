var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dbConnect = require('./config/db').connect;
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
var authRouter = require('./routes/auth');
var chatRouter = require('./routes/chat');
var usersRouter = require('./routes/users');
const mongoose = require('mongoose');
const env = require('dotenv').config();

//connect to db
dbConnect(process.env.DB_CONNECT.toString());

var app = express();

app.use(fileUpload({
  limits: { fileSize: 52428800 }
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '100mb'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/chat', chatRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
