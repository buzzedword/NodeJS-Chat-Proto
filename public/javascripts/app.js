var chat = {}, response = {}, session = {}; 
(function(){
$(function(){
	var socket = new io.Socket(), _response = {}, _status = {};
    $('#uname').button();
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
    chat.requestStatus = function(){
        socket.send({
            'type' : 'status'
        });
    };
    chat.disconnect = function(){
        socket.disconnect();  
    };
	
	response.setSession = function(sessionId){
		_response.ID = sessionId;
	};
	response.getSession = function(){
		return _response.ID;
	};
	response.writeMessage = function(msg){
     	var element = document.createElement('p'), context;
		element.innerHTML = msg;
        context = document.getElementById('chat_context');
		context.appendChild(element);
        context.scrollTop = context.scrollHeight;
	};
	
	session.setStatus = function(status){
		_status.connected = status;
	};
	session.getStatus = function(){
		return _status.connected;
	};
	
    $('form').submit(function(e){
        console.log('test');
        e.preventDefault;
    }).bind('keydown keypress', function(e){
        console.log('hi');    
    });
	
	(function(){
		socket.on('connect', function(){
		  document.getElementById('chat_context').innerHTML = '';
    	  document.getElementById('connected_context').innerHTML = '';          
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
                case 'status' :
                    response.remoteStatus = data.content;
                    break;
				default :
					response.writeMessage(data.content);			
			}
		});
		socket.on('disconnect', function(){
		  session.setStatus = false;		
		}); 
	}());
});
}());