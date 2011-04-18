
/**
 * Module dependencies.
 */
require.paths.unshift('node_modules');

var express = require('express'),
    io = require('socket.io'),
    app = module.exports = express.createServer();

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
var clientTable = [],
    socket = io.listen(app); 
socket.on('connection', function(client){
    var currentUser, chat = {};	
    chat.solo = function(message){
		client.send({
			'content' : message,
			'type' : 'solo'
		});    	
    };
	chat.broadcast = function(message){
		client.broadcast({
			'content' : message,
			'type'	: 'broadcast'
		});
	};
	chat.all = function(message){
		chat.solo(message);
		chat.broadcast(message);
	};
	
    console.log(clientTable);
    clientTable.push({'session': client.sessionId});

    for (var i = 0; i < clientTable.length; i++){
        if (clientTable[i]['session']== client.sessionId){
            currentUser = {'index' : i, 'session' : client.sessionId};
        }
    }
    currentUser.identity = client.sessionId;
	console.log('New client detected. Session ID: '+ currentUser.session);
	
  	chat.solo('<h3>Welcome to the Thunderdome.</h3>\n');
    chat.solo('Your session ID is <strong>' + currentUser.session + '</strong>\n');
  
  client.on('message', function(data){ 
  	console.log('Client message from '+currentUser.session+': ' + data.content);
  	
  	switch (data.type){
  		case 'message' :
			chat.all(currentUser.identity + ': ' + data.content);
			break;
		case 'UID' :
			if (data.content == 'unidentified'){
				currentUser.identity = client.sessionId;
				chat.broadcast(currentUser.identity+' has connected.');				
			} else {
				currentUser.identity = data.content;
				chat.broadcast(currentUser.identity+' has connected.');								
			}
			break;
  	}
  }) 
  client.on('disconnect', function(){ 
  	console.log('Client disconnected.');
    chat.broadcast(currentUser.identity+' has disconnected.');
    clientTable.splice(currentUser['index']);
    console.log(clientTable);
  }) 
}); 
