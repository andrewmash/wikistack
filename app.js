var express = require('express');
var app = express();
var swig = require('swig');
require('./filters')(swig);
var morgan = require('morgan');
var bodyParser = require('body-parser');
var routes = require('./routes/');
var wikiRouter = require('./routes/wiki');

app.set('views', __dirname + '/views');
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files
// have it use swig to do so
app.engine('html', swig.renderFile);
// turn off swig's caching
swig.setDefaults({cache: false});

app.listen(3000);

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.use('/', routes);
app.use('/wiki', wikiRouter);
