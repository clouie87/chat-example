//resource: http://expressjs.com/4x/api.html#application
/* to create an express application we need:
var express = require('express');
var app = express(); */

var app = require('express')();// i think these lines 2 and 3 are summed up to one in this line. 
var http = require('http').Server(app);
var io= require('socket.io')(http); //after downloading the socket.io we need to state the var we initialize the (socket.io)
//and pass it through the http object
//var proxyaddr = require('proxy-addr');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/', function (req, res){
	res.send('Welcome');
});

/*app.set('trust proxy', function(ip){
	if(ip === '127.0.0.1' || ip === '104.131.24.149') return true; //trusted IP
	else return false;
}); this sets up my trusted proxy but i need to figure out what that means for my ip... */

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

/*proxyaddr(req, function(addr){ return addr === '127.0.0.1'})
proxyaddr(req, function(addr, i){ return i< 1}); */

http.listen(3000, function(){
	console.log('listening on *:3000');
});