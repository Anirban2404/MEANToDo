// app.js

// set up ======================================================================
// get all the tools we need
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var tasks = require('./routes/tasks');
var db = require('./config/database');


// mongoose for mongodb

// configuration ===============================================================
mongoose.connect(db.url); // connect to our password database

//on connection
var sessions = mongoose.connection;

// Init App
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// set up our express application
app.use(logger('dev'));  // log every request to the console

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json

//CookieParser Middleware
app.use(cookieParser()); // read cookies (needed for auth)


// required for passport
// use sessions for tracking logins -- Express Session
app.use(session({
    secret: 'jK2sGD4nifcf3nMqxUcmbXjh8wxUmz0k',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: sessions
    })
})); // session secret

// static files
app.use(express.static(path.join(__dirname, 'public')));

// Express Validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// application -------------------------------------------------------------
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/todo.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// routes ======================================================================

app.get('/api/todos', tasks.list);
app.post('/api/todos', tasks.add);
app.delete('/api/todos/:todo_id', tasks.delete);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
