var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var createRouter = require('./routes/create');
var editRouter = require('./routes/edit');
var wikiRouter = require('./routes/wiki');
var manuellRouter = require('./routes/manuell');
var navigationRouter = require('./routes/navigation');
var poiRouter = require('./routes/poi');


var app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/create', createRouter);
app.use('/edit', editRouter);
app.use('/wiki', wikiRouter);
app.use('/manuell', manuellRouter);
app.use('/navigation', navigationRouter);


//dieser router existiert nicht um eine Seite zu servieren, sondern die POI-daten.
app.use('/poi', poiRouter);


app.use('/bootstrap', express.static("node_modules/bootstrap/dist"))
app.use('/leaflet', express.static("node_modules/leaflet/dist"))
app.use('/leaflet-draw', express.static("node_modules/leaflet-draw/dist"))



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
