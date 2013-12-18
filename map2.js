function InputGroup(number, origin, destination) {
	var mapGroup = document.createElement('div');
	mapGroup.setAttribute("id","group"+number);
	mapGroup.setAttribute("class","group");
	document.querySelector('#sidebar').appendChild(mapGroup);

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
	from.addEventListener("keypress", sendQuery);
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
	to.addEventListener("keypress", sendQuery);
	document.querySelector("#group"+number).appendChild(to);

	function sendQuery(e) { 
		// if the key is return
		if(e.keyCode === 13){
			query(from.value, to.value, function(DirectionsResult, DirectionsStatus) {
				if (DirectionsStatus != "OK") {
					alert(DirectionsStatus);
				}
				else {
					mapView.display(DirectionsResult);
				}
			});
		}
	}

	var mapView = new MapView(number);
}


function initMapAndSidebar() {
	var sidebarDiv = document.createElement('div');
	sidebarDiv.setAttribute("id", "sidebar");
	document.querySelector("body").appendChild(sidebarDiv);

	var mapDiv = document.createElement('div');
	mapDiv.setAttribute("id", "map");
	document.querySelector("body").appendChild(mapDiv);

	var mapOptions = {
		center: new google.maps.LatLng(40.72078,-74.001119),
		zoom: 16,
		};
	map = new google.maps.Map(mapDiv, mapOptions);
}


function MapView(number) {
	this.timeDiv = document.createElement('div');
	this.timeDiv.setAttribute("class","time");
	document.querySelector("#group"+number).appendChild(this.timeDiv);

	this.renderer = new google.maps.DirectionsRenderer();
	this.renderer.setMap(map);
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
		origin: from,
		destination: to,
		travelMode: google.maps.TravelMode.WALKING,
		region: "US"
	}
	var directionsService = new google.maps.DirectionsService;
	directionsService.route(directionstorequest, callback);
}


function initialize() {
	initMapAndSidebar();
	new InputGroup(1, "San Francisco", null);
	// makeMapDiv(2, null, null);
	new InputGroup(3, null, "New York");
}

google.maps.event.addDomListener(window, 'load', initialize);