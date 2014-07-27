/**
	server.js

	Will create a simple echo server. Once running
	simply connect via telnet and be amazed.
**/
var net = require('net');
var port = 8888;

var server = net.createServer(function(socket) {

	// Introduce yourself
	socket.once ('data', function(data) {
		socket.write('I am only going to say this once! I am a echo server!\n');
	});

	// Tell them what they said
	socket.on('data', function(data) {
		socket.write(data);
	});
});

// Start it up
server.listen(port, function() {
	console.log('Echo server started on ' + server.address().address + ':' + server.address().port);
});