function makeMapDiv(number, origin, destination) {
	var mapGroup = document.createElement('div');
	mapGroup.setAttribute("id","group"+number);
	mapGroup.setAttribute("class","group");
	document.querySelector('body').appendChild(mapGroup);

	var from = document.createElement('input');
	from.setAttribute("class", "from");
	// from.setAttribute("autofocus", "true");
	from.setAttribute("spellcheck", "false");
	if(origin) {
		from.setAttribute("value", origin);
	}
	else {
		from.setAttribute("placeholder", "From..");
	}
	
	document.querySelector("#group"+number).appendChild(from);

	var to = document.createElement('input');
	to.setAttribute("class", "to");
	to.setAttribute("spellcheck", "false");
	if(destination) {
		to.setAttribute("value", destination);
	}
	else {
		to.setAttribute("placeholder", "To..");
	}
	to.addEventListener("keypress", function(e){ 
			// if the key is return
			if(e.keyCode === 13){
				query(from, to, function(DirectionsResult, DirectionsStatus) {
					if (DirectionsStatus != "OK") {
						alert(DirectionsStatus);
					}
					else {
						mapView.display(DirectionsResult);
					}
				});
			}
		});

	document.querySelector("#group"+number).appendChild(to);

	var mapView = new MapView(number);
	// query(origin, destination);
}

function MapView(number) {
	var mapDiv = document.createElement('div');
	mapDiv.setAttribute("class", "map");
	mapDiv.setAttribute("style", "height: 100 px; width: 100%");
	document.querySelector("#group"+number).appendChild(mapDiv);

	this.timeDiv = document.createElement('div');
	this.timeDiv.setAttribute("class","time");
	document.querySelector("#group"+number).appendChild(this.timeDiv);

	var mapOptions = {
		center: new google.maps.LatLng(40.72078,-74.001119),
		zoom: 16,
		};
	this.map = new google.maps.Map(mapDiv, mapOptions);

	this.renderer = new google.maps.DirectionsRenderer();
	this.renderer.setMap(this.map);
}


MapView.prototype = {
	display: function(DirectionsResult) {
		this.renderer.setDirections(DirectionsResult);
		if(DirectionsResult.routes[0].legs) {
			var time = 0;
			for (var i=0; i<DirectionsResult.routes[0].legs.length; i++) {
				console.log(DirectionsResult.routes[0].legs[i].duration.value);
				time += DirectionsResult.routes[0].legs[i].duration.value;
			}
			this.timeDiv.innerText = time;
		}
	} 
}

function query(from, to, callback) {
	var directionstorequest = {
		origin: from.value,
		destination: to.value,
		travelMode: google.maps.TravelMode.WALKING,
		region: "US"
	}
	console.log(from.value, to.value);
	var directionsService = new google.maps.DirectionsService;
	directionsService.route(directionstorequest, callback);
	// console.log(from.value, to.value);
}


function initialize() {
	makeMapDiv(1, "San Francisco", null);
	// makeMapDiv(2, null, null);
	makeMapDiv(3, null, "New York");
}

google.maps.event.addDomListener(window, 'load', initialize);