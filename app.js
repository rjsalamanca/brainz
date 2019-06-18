const express = require('express'),
    path = require('path'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    createError = require('http-errors'),
    es6Renderer = require('express-es6-template-engine'),
    indexRouter = require('./routes/index'),
    usersRouter = require('./routes/users'),
    gamesRouter = require('./routes/games'),
    scoresRouter = require('./routes/scores');

const app = express();

app.set('views','./views');
app.set('view engine', 'html');
app.engine('html', es6Renderer);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret:'supbruh',
    resave: false,
    saveUninitialized: true,
    isLoggedIn: false
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/games',gamesRouter);
app.use('/scores', scoresRouter);
app.use(function(req, res, next) {
    next(createError(404));
  });
  
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  

module.exports = app;
