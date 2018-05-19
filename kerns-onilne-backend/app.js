const express            = require('express');
const path               = require('path');
const favicon            = require('serve-favicon');
const logger             = require('morgan');
const cookieParser       = require('cookie-parser');
const bodyParser         = require('body-parser');
const expressLayouts     = require('express-ejs-layouts');
const mongoose           = require('mongoose');
const passport           = require('passport');
const session            = require('express-session');
const MongoStore         = require('connect-mongo')(session);
const LocalStrategy      = require('passport-local').Strategy;
const bcrypt             = require('bcrypt');
const multer             = require('multer');
const User               = require('./models/user');
const Product            = require('./models/products');
const Quotes       = require('./models/quotes');
const authRoutes = require('./routes/authentication');
const productRoutes = require('./routes/products');
require('./configs/database');
require('./configs/passport');

require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI);

var app = express();
app.listen(4200);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use (
  session({
    secret: "This is a secret",
    resave: true,
    saveUninitialiazed: true

  })
);

app.use(passport.initialize());
app.use(passport.session());



app.use('/', authRoutes);







// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
