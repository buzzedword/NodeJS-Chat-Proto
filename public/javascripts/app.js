var chat = {}, response = {}, session = {}; 
(function(){
	var socket = new io.Socket(), _response = {}, _status = {}; 
	chat.sendID = function(UID){
		if (typeof UID == 'undefined') {
			UID = 'unidentified';
		}
		socket.connect();
		socket.send({
			'content' : UID,
			'type'	: 'UID'
		});
	};
	chat.sendMessage = function(msg){
		socket.send({
			'content' : msg,
			'type' : 'message'
		});
	};
	
	response.setSession = function(sessionId){
		_response.ID = sessionId;
	};
	response.getSession = function(){
		return _response.ID;
	};
	response.writeMessage = function(msg){
     	var element = document.createElement('p');
		element.innerHTML = msg;
		document.getElementsByTagName('body')[0].appendChild(element);
	};
	
	session.setStatus = function(status){
		_status.connected = status;
	};
	session.getStatus = function(){
		return _status.connected;
	};
	
	
	(function(){
		socket.on('connect', function(){
		  document.getElementsByTagName('body')[0].innerHTML = '';
		  session.setStatus = true;
		}); 
		socket.on('message', function(data){
			switch (data.type){
				case 'broadcast' :
					response.writeMessage(data.content);
					break;
				case 'private' :
					// not implemented yet
					break;
				default :
					response.writeMessage(data.content);			
			}
		});
		socket.on('disconnect', function(){
		  session.setStatus = false;		
		}); 
	}());
}());