const express = require('express'),
    path = require('path'),

    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
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


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/games',gamesRouter);
app.use('/scores', scoresRouter);

module.exports = app;
