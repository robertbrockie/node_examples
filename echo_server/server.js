/**
	server.js

	Will create a simple echo server. Once running
	simply connect via telnet and annoy yourself.
**/
var net = require('net');

var server = net.createServer(function(socket) {
	socket.on('data', function(data) {
		socket.write(data);
	});
});

server.listen(8888);