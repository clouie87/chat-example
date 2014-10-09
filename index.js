//resource: http://expressjs.com/4x/api.html#application

var express = require('express');
var app = express();// originally var app = require('express')(); which i think sums up line 3 and 4 but we need the var express if i want to add in my own js. 
var http = require('http').Server(app);
var io= require('socket.io')(http); //after downloading the socket.io we need to state the var we initialize the (socket.io)
//and pass it through the http object

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/', function (req, res){
	res.send('Welcome');
});

app.use('/styles', express.static(__dirname +'/styles'));

app.use('/scripts', express.static(__dirname +'/scripts'));

app.use(function (req, res, next) {
	console.log('Time: %d', Date.now());
	next();
});

io.on('connection', function(socket){ // then listen to the connection event for incoming sockets
	socket.on('chat message', function(msg){
		io.emit('chat message', msg);
		console.log('message: '+ msg);
	});// this will print it to the console... but we want to print it to the page! (broadcast it to the users)
		console.log('a user connected'); // if there is a connection, log it to the console. 
		socket.on('disconnect', function(){ // listen to people disconnection events for outgoing socket
		console.log('user disconnected');// if there is a disconnection, log it to the console. 
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000...');
});