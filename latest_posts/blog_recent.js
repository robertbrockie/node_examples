var http = require('http');
var fs = require('fs');

function handleError(res, err) {
	console.error(err);
	res.end('Server Error');
}

function renderTemplate(data, titles, res) {
	var tmpl = data.toString();
	var html = tmpl.replace('%', titles.join('</li><li>'));
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.end(html);
}

function getTitles(res) {
	fs.readFile('./titles.json', function(err, data) {
		if (err) return handleError(res, err);
		
		var titles = JSON.parse(data.toString());

		getTemplate(res, titles);
	});
}

function getTemplate(res, titles) {
	fs.readFile('./template.html', function(err, data) {
		if (err) return handleError(res, err);
	
		renderTemplate(data, titles, res);
	});
}

http.createServer(function(req, res) {
	getTitles(res)
}).listen(8000, "127.0.0.1");