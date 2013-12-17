var request = require("request");
var fs = require('fs');

function getMapData(origin, destination) {
	outputfile = origin+"to"+destination+".json";
	url = "http://maps.googleapis.com/maps/api/directions/json?origin="+origin+"&destination="+destination+"&mode=walking&sensor=false"
	request({url:url, followAllRedirects:true}, function (error, response, body) {
		if (!error) {
			fs.writeFile(outputfile, body, function(err) {
				if(err) {
					console.log(err);
				}
				else {
					console.log("JSON saved to "+outputfile);
				}
			});
		}
		else {
			console.log("Couldn't get url");
		}
	});	
}

getMapData("Broadway","Times%20Square");