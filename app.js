var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var zhuce = require('./routes/users');
var dlcgtz = require('./routes/signin');
var mongo = require('./routes/tc_dl');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//使用express-session模块，暂存
app.use(session({
    secret: 'keyboard cat',
    cookie: ('name', 'value', { path: '/', httpOnly: true, secure: false, maxAge: 1000 * 60 * 30 }),
    //重新保存：强制会话保存即使是未修改的。默认为true但是得写上
    resave: true,
    //强制“未初始化”的会话保存到存储。 
    saveUninitialized: true,
}));

// 更新session时间，活动状态不失效
// use this middleware to reset cookie expiration time 
// when user hit page every time
app.use(function(req, res, next) {
    req.session._garbage = Date();
    req.session.touch();
    next();
});


app.use('/', indexRouter);
app.use('/users', zhuce);
app.use('/signin', dlcgtz);
app.use('/tc_dl', mongo);
// app.use('/admin', admin);

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

module.exports = app;