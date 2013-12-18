function InputGroup(origin, destination, insertLocation) {
	this.mapGroup = document.createElement('div');
	// this.mapGroup.setAttribute("id","group"+number);
	this.mapGroup.setAttribute("class","group");
	if (!insertLocation) {
		document.querySelector('#sidebar').appendChild(this.mapGroup);
	}
	else {
		console.log("inserting at:"+insertLocation);
		document.querySelector('#sidebar').insertBefore(this.mapGroup, insertLocation);
	}

	var self = this;
	if(!origin) {
		var addButton = document.createElement('input');
		addButton.setAttribute("type", "button");
		addButton.setAttribute("value", "more div");
		addButton.addEventListener("click", function () {
					console.log("this:"+self);
					makeNewInput(self.mapGroup);
				});
		this.mapGroup.appendChild(addButton);
	}

	if(!origin && !destination) {
		var removeButton = document.createElement('input');
		removeButton.setAttribute("type", "button");
		removeButton.setAttribute("value", "less div");
		removeButton.addEventListener("click", function () {
					document.querySelector("#sidebar").removeChild(self.mapGroup);
				});
		this.mapGroup.appendChild(removeButton);
	}

	var from = document.createElement('input');
	from.setAttribute("class", "from");
	// from.setAttribute("autofocus", "true");
	from.setAttribute("spellcheck", "false");
	if(origin) {
		from.setAttribute("value", origin);
		from.setAttribute("readonly", "true");
	}
	else {
		from.setAttribute("placeholder", "From..");
	}
	from.addEventListener("keypress", sendQuery);
	this.mapGroup.appendChild(from);


	var to = document.createElement('input');
	to.setAttribute("class", "to");
	to.setAttribute("spellcheck", "false");
	if(destination) {
		to.setAttribute("value", destination);
		to.setAttribute("readonly", "true");
	}
	else {
		to.setAttribute("placeholder", "To..");
	}
	to.addEventListener("keypress", sendQuery);
	this.mapGroup.appendChild(to);

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

	var mapView = new MapView(this.mapGroup);

	this.getTo = function() {
		return to.value;
	};
	this.getFrom = function () {
		return from.value;
	};
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


function MapView(locationDiv) {
	this.timeDiv = document.createElement('div');
	this.timeDiv.setAttribute("class","time");
	locationDiv.appendChild(this.timeDiv);

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

function makeNewInput(insertLocation) {
	new InputGroup(null, null, insertLocation);
	console.log("new input, before: " + insertLocation);
}

function initInputs(number, origin, destination) {
	// inputs = [];
	for (i=1; i<=number; i++) {
		var thisorigin, thisdestination;
		if (i==1) {
			thisorigin = origin;
		}
		else {
			thisorigin = null;
		}
		if (i == number) {
			thisdestination = destination;
		}
		else {
			thisdestination = null;
		}
		var thisgroup = new InputGroup(thisorigin, thisdestination, null);
		// inputs.push(thisgroup);
	}
}

function initialize() {
	initMapAndSidebar();
	initInputs(2, "San Francisco", "New York");
	// groupOne = new InputGroup(1, "San Francisco", null);
	// // makeMapDiv(2, null, null);
	// groupThree = new InputGroup(3, null, "New York");
}

google.maps.event.addDomListener(window, 'load', initialize);