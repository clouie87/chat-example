//resource: http://expressjs.com/4x/api.html#application

var express = require('express');
var app = express();// originally var app = require('express')(); which i think sums up line 3 and 4 but we need the var express if i want to add in my own js.
var http = require('http').Server(app);
var io= require('socket.io')(http); //after downloading the socket.io we need to state the var we initialize the (socket.io)
//and pass it through the http object\
var redis = require("redis");

var client = redis.createClient();

var userCount = 0;

client.on("error", function (err) {
	console.log("Error " + err);
});

client.del('username');

client.set("app name", "simple chat", redis.print); // we set a key for app name here which we get on line 30

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});



app.get('/', function (req, res){
	res.send('Welcome');
});

app.use('/styles', express.static(__dirname +'/styles'));

app.use('/scripts', express.static(__dirname +'/scripts'));


io.on('connection', function(socket){ // then listen to the connection event for incoming sockets
	var room = '';

	userCount = userCount+1;
	var currentUsername = "";

	console.log("Someone connected there are", userCount, "users");

	client.lrange('username', 0, -1, function(err, usernames){ //then we retrieve the list and print it out
		io.to(room).emit('username', usernames); //io.emit so it gets sent to all the users (including the person that joined
		//socket.broadcast.emit('username', username);
		console.log("the current users are: ", usernames);
		//socket.emit('username', username);
		socket.emit("users",usernames);
	});

	socket.on('join', function(name){
		socket.join(room);
		currentUsername = name; // assign the user a Username in the local memory
		client.lpush('username', name, function(err, length){ // we want to push the name value onto the list 'username'
			console.log("length:",length);
			socket.emit("joined",name);
		});


// in redis we will keep the history plus the room name so that we know which room the msg was sent from and can send back to newUsers on connection
		client.lrange('history'+ room, 0, 9, function(err, history){ // when a new client joins we want to print the history
			console.log("history: " + room, history);
			socket.emit('history', history); // emit it to all users (but will only be sent to the new connection!)
		});//socket.emit goes only to the user connected so we dont need to use to(room) because we dont care which room he is in, regardless he needs the history
	});

	socket.on("createRoom", function(roomName){
		console.log("roomName has been created:", roomName);
		socket.join(roomName);
		socket.leave(room);
		room = roomName;
		io.emit("createdRoom", room);
	});

	socket.on('switchRoom', function(newRoom){ //listen for switching of rooms
		socket.leave(room);
		socket.join(newRoom);
		room = newRoom; //this is the new room
		//keep separate histories for separate rooms
		var history = "history"+room;
		console.log("new switch history:",history);
		client.lrange(history, 0, 9, function(err, history){ // when a new client joins we want to print the history
			socket.emit('history', history); // emit it to all users (but will only be sent to the new connection!)
		});
	});

	client.get("app name", function(err, reply){ //we get the key value and print it to the console.
		console.log("app name is: " + reply);
	});

	socket.on('chat message', function(msg){
		console.log('the message is: ' + msg);
    console.log('sound');

    socket.broadcast.emit('play');

		io.to(room).emit('chat message', msg);
		client.lpush('history' + room, msg, function(err, history){
			console.log(history);
		}); //to store the message
	}); // this will print it to the console... but we want to print it to the page! (broadcast it to the users)

	socket.on('disconnect', function(){ // listen to people disconnection events for outgoing socket
		client.lrem('username', 1, currentUsername);// remove the client that is disconnecting
		client.lrange('username', 0, -1, function(err, username){ // reprint the list to account for the person that disconnected
			io.to(room).emit('username', username);
			console.log("the current users are: ", username);
		});
		userCount = userCount-1;
		console.log("Someone disconnected there are", userCount, "users");// if there is a disconnection, log it to the console.
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000...');
});
