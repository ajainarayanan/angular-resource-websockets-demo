
var express = require('express'),
    finalhandler = require('finalhandler'),
    serveFavicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    cookieParser = require('cookie-parser'),
    serveFavicon = require('serve-favicon'),
    sockjs = require('sockjs'),
    Aggregator = require('./server/aggregator.js'),
    http = require('http'),
    fs = require('fs'),
    log4js = require('log4js');

/**
 * Configuring the logger. In order to use the logger anywhere
 * in the BE, include the following:
 *    var log4js = require('log4js');
 *    var logger = log4js.getLogger();
 *
 * We configure using LOG4JS_CONFIG specified file or we use
 * the default provided in the conf/log4js.json file.
 */
if(process.env.LOG4JS_CONFIG) {
  log4js.configure({}, { reloadSecs: 600});
} else {
  log4js.configure(__dirname + "/conf/log4js.json", { reloadSecs: 300});
}

// Get a log handle.
var log = log4js.getLogger('default');


var app = express();

// middleware
try { app.use(serveFavicon(__dirname + '/img/favicon.png')); }
catch(e) { log.error('Favicon missing! Please run `gulp build`'); }
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// serve static assets
app.use('/assets', [
  express.static(__dirname + '/dist/assets', {
    index: false
  }),
  function(req, res) {
    finalhandler(req, res)(false); // 404
  }
]);

// any other path, serve index.html
app.all('*', [
  function (req, res) {
   res.sendFile(__dirname + '/dist/index.html');
  }
]);

var server = http.createServer(app),
    port = 3000;

server.listen(port, '127.0.0.1', function () {
  log.info('Demo server listening on port %s', port);
});

var sockServer = sockjs.createServer({
  log: function (lvl, msg) {
    log.trace(msg);
  }
});

sockServer.on('connection', function (c) {
  var a = new Aggregator(c);
  c.on('close', function () {
    delete a;
  });
});

sockServer.installHandlers(server, { prefix: '/_sock' });
