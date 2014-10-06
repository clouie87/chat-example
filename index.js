var app = require('express')();
var http = require('http').Server(app);
var io= require('socket.io')(http); //after downloading the socket.io we need to state the var we initialize the (socket.io)
//and pass it through the http object

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){ // then listen to the connection event for incoming sockets
	console.log('a user connected'); // if there is a connection, log it to the console. 
	socket.on('disconnect', function(){ // listen to people disconnection events for outgoing socket
		console.log('user disconnected');// if there is a disconnection, log it to the console. 
	}
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});