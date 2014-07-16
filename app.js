var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var swig = require('swig'),
    moment = require('moment');

var routes = require('./routes/index');
var schedule = require('./routes/schedule');
// var teacher = require('./routes/teacher');
var student = require('./routes/student');
var models = require('./models');

var app = express();

// view engine setup
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// all environments
app.set('port', process.env.PORT || 9999);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/student', express.static(path.join(__dirname, 'public')));
app.use('/teacher', express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/schedule', schedule);
app.use('/student', student);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

http.createServer(app).listen(app.get('port'), function(err){
  if(err) {console.log(err);}
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
