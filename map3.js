function InputGroup(origin, destination, location) {
	this.from = origin;
	this.to = destination;
	
	var inputRenderer = new InputRenderer(this, location);

	this.addLeg = function() {
		this.from = inputRenderer.getFrom();
		this.to = inputRenderer.getTo();
		var newGroup = new InputGroup(this.from, null, inputRenderer.mainDiv);
		addToArray(inputs, newGroup, this);
		inputRenderer.setFrom("");
		console.log(inputs);
	}
}

function InputRenderer(inputGroup, location) {
	this.inputGroup = inputGroup;

	this.mainDiv = document.createElement('div');
	this.mainDiv.setAttribute("class","group");
	if(location) {
		document.querySelector('#sidebar').insertBefore(this.mainDiv, location);
	}
	else {
		document.querySelector('#sidebar').appendChild(this.mainDiv);	
	}

	var self = this;

	var from = document.createElement('input');
	from.setAttribute("class", "from");
	// from.setAttribute("autofocus", "true");
	from.setAttribute("spellcheck", "false");
	if(inputGroup.from) {
		from.setAttribute("value", inputGroup.from);
		from.setAttribute("readonly", "true");
	}
	else {
		from.setAttribute("placeholder", "From..");
	}
	from.addEventListener("keypress", sendQuery);
	this.mainDiv.appendChild(from);

	var self = this;
	var addButton = document.createElement('input');
	addButton.setAttribute("type", "button");
	addButton.setAttribute("value", "more div");
	addButton.addEventListener("click", function() {
		self.inputGroup.addLeg();
	});
	this.mainDiv.appendChild(addButton);
	

	var to = document.createElement('input');
	to.setAttribute("class", "to");
	to.setAttribute("spellcheck", "false");
	if(inputGroup.to) {
		to.setAttribute("value", inputGroup.to);
		to.setAttribute("readonly", "true");
	}
	else {
		to.setAttribute("placeholder", "To..");
	}
	to.addEventListener("keypress", sendQuery);
	this.mainDiv.appendChild(to);

	var self = this;
	if(!inputGroup.from && !inputGroup.to) {
		var removeButton = document.createElement('img');
		removeButton.src = "img/close.png";
		removeButton.addEventListener("click", function () {
					document.querySelector("#sidebar").removeChild(self.mainDiv);
				});
		this.mainDiv.appendChild(removeButton);
	}

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

	this.getTo = function() {
		return to.value;
	};
	this.getFrom = function () {
		return from.value;
	};
	this.setTo = function(value) {
		to.setAttribute("value", value);
	};
	this.setFrom = function (value) {
		from.setAttribute("value", value);
	};

	var mapView = new MapView(this.mainDiv);
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


//addtoArray adds an element just before the beforeElement
function addToArray(target, newElement, beforeElement) {
	var location = target.indexOf(beforeElement);
	target.splice(location, 0, newElement);
}

function initInputs(number, origin, destination) {
	inputs = [];
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
		inputs.push(thisgroup);
	}
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


function initialize() {
	initMapAndSidebar();
	initInputs(4, "San Francisco", "New York");
}

google.maps.event.addDomListener(window, 'load', initialize);