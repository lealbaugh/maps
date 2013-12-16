// -------------GAME INFO---------------------------
var request = require("request");


function getMapData(origin, destination, socket) {
	url = "http://maps.googleapis.com/maps/api/directions/json?origin="+encodeURIComponent(origin)+"&destination="+encodeURIComponent(destination)+"&mode=walking&sensor=false"
	console.log(url);
	request({url:url, followAllRedirects:true}, function (error, response, body) {
		if (!error) {
			console.log("received valid response");
			socket.emit("distance", getDistance(body));
		}
		else {
			console.log(error);
			socket.emit("distance", "Fail.");
		}
	});	
}

function getDistance(directions) {
	var distance;
	directionsJSON = JSON.parse(directions);
	console.log(directionsJSON);
	if(directionsJSON.routes.length>0) {
		distance = directionsJSON.routes[0].legs[0].duration.value;
	}
	else {
		distance = "No such route."
	}
	return distance;
}

// ----------------SERVER----------------------------
var http = require('http')
  , express = require('express')
  , app = express()
  , port = process.env.PORT || 5000;
  // get port from environmental variable, as is the Heroku way

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(port, function() { console.log(this._connectionKey)});

console.log('http server listening on %d', port);

// Create a Socket.IO instance, passing it our server
var io = require('socket.io').listen(server);
io.set('log level', 1);

// Add a connect listener
io.sockets.on('connection', function(socket){ 

	socket.on('message',function(event){ 
		console.log('Message: ',event);
	});

	socket.on('query', function(query){
		console.log(query);
		for (var i=0; i<query.length;i++) {
			getMapData(query[i][0], query[i][1], socket);
		}
	});
});





