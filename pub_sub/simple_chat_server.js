var events = require('events');
var net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

// Add a listener for the join event that stores a user's client object
// allowing the application to send data back to the user.
channel.on('join', function(id, client) {
	this.clients[id] = client;
	this.subscriptions[id] = function(senderId, message) {
		// Ignore data if it's been dsirectly broadcast to the user.
		if (id != senderId) {
			this.clients[id].write(id + ':' + message);
		}
	}

	// Add a listener, specific to the current user, for the broadcast event.
	this.on('broadcast', this.subscriptions[id]);
});

// Create listener for leave event.
channel.on('leave', function(id) {
	// Remove broadcast listener for specifc client
	channel.removeListener('broadcast', this.subscriptions[id]);
	channel.emit('broadcast', id, id + ' has left the chat.\n');
});

// Create listener for a shutdown event.
channel.on('shutdown', function() {
	channel.emit('broadcast', '', 'Chat has ended.\n');
	channel.removeAllListeners('broadcast');
});

var server = net.createServer(function (client) {
	var id = client.remoteAddress + ':' + client.remotePort;

	// Emit a join event when a user connects to the server, specifying the
	// user id and client object.
	// client.on('connect', function() {
	// 	channel.emit('join', id, client);
	// });

	// The client.on('connect', function{}) above doesn't seem to work so I'll 
	// emit manually (TODO: why?)
	channel.emit('join', id, client);

	// Emit a channel broadcast event specifying the user id
	// and message, when any user sends data.
	client.on('data', function(data) {
		data = data.toString();

		if (data == 'shutdown\r\n') {
			channel.emit('shutdown');
		}
		channel.emit('broadcast', id, data);
	});

	// Emit leave event when client disconnects
	client.on('close', function() {
		channel.emit('leave', id);
	});
});

server.listen(8888);