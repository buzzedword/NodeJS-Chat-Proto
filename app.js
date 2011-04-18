
/**
 * Module dependencies.
 */
require.paths.unshift('node_modules');

var express = require('express'),
    app = module.exports = express.createServer(),
    socket = require('./classes/socket');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Realtime Updates Proof of Concept'
  });
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(process.env.C9_PORT);
  console.log("Express server listening on port %d", app.address().port);
}

socket.init(app);