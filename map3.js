// Origin and destination are TextEntry objects with a string map location and whether or not they are changeable.
// Location, if provided, is the location in the DOM for the InputRenderer to insert before.
function InputGroup(origin, destination, location) {
	this.from = origin;
	this.to = destination;
	this.timeInSeconds = 0;
	
	var inputRenderer = new InputRenderer(this, location);

	this.addLeg = function() {
		this.from = inputRenderer.getFrom();
		this.to = inputRenderer.getTo();
		var newGroup = new InputGroup(this.from, new TextEntry("", true), inputRenderer.mainDiv);
		addToArray(inputs, newGroup, this);
		inputRenderer.setFrom(new TextEntry("", true));
	}
}

function TextEntry(place, changeable) {
	this.place = place;
	this.changeable = changeable;
}

function InputRenderer(inputGroup, location) {
	this.inputGroup = inputGroup;

	this.getTo = function() {
		var changeable = true;
		if (to.getAttribute("readonly") == "true" || to.getAttribute("readonly") == true) {
			changeable = false;
		}
		var entry = new TextEntry(to.value, changeable);
		return entry;
	};

	this.getFrom = function () {
		var changeable = true;
		if (from.getAttribute("readonly") == "true" || from.getAttribute("readonly") == true) {
			changeable = false;
		}
		var entry = new TextEntry(from.value, changeable);
		return entry;
	};
	
	this.setTo = function(textEntry) {
		if(textEntry.changeable) {
			to.setAttribute("readonly", false);
			to.removeAttribute("readonly");
		}
		else {
			to.setAttribute("readonly", true);
		}
		to.setAttribute("placeholder", "To..");
		to.value = textEntry.place;
	};

	this.setFrom = function (textEntry) {
		if(textEntry.changeable) {
			from.setAttribute("readonly", false);
			from.removeAttribute("readonly");
		}
		else {
			from.setAttribute("readonly", true);
		}
		from.setAttribute("placeholder", "From..");
		from.value = textEntry.place;
	};



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
	from.setAttribute("spellcheck", "false");
	from.addEventListener("keypress", sendQuery);
	this.mainDiv.appendChild(from);
	this.setFrom(inputGroup.from);


	var addButton = document.createElement('input');
	addButton.setAttribute("type", "button");
	addButton.setAttribute("value", "+");
	addButton.addEventListener("click", function() {
		self.inputGroup.addLeg();
		console.log(inputs);
	});
	this.mainDiv.appendChild(addButton);
	

	var to = document.createElement('input');
	to.setAttribute("class", "to");
	to.setAttribute("spellcheck", "false");
	to.addEventListener("keypress", sendQuery);
	this.mainDiv.appendChild(to);
	this.setTo(inputGroup.to);

	var self = this;
	if(inputGroup.from.changeable && inputGroup.to.changeable) {
		var removeButton = document.createElement('img');
		removeButton.src = "img/close.png";
		removeButton.addEventListener("click", function () {
					removeFromArray(inputs, self.inputGroup);
					document.querySelector("#sidebar").removeChild(self.mainDiv);
					console.log(inputs);
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


//addtoArray adds an element just before the beforeElement
function addToArray(target, newElement, beforeElement) {
	var location = target.indexOf(beforeElement);
	target.splice(location, 0, newElement);
}

function removeFromArray(target, elementToRemove) {
	var location = target.indexOf(elementToRemove);
	target.splice(location, 1);
}

function initInputs(number, origin, destination) {
	inputs = [];
	for (i=1; i<=number; i++) {
		var thisorigin, thisdestination;
		if (i==1) {
			thisorigin = new TextEntry(origin, false);
		}
		else {
			thisorigin = new TextEntry("", true);
		}
		if (i == number) {
			thisdestination = new TextEntry(destination, false);
		}
		else {
			thisdestination = new TextEntry("", true);
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
	initInputs(1, "San Francisco", "New York");
}

google.maps.event.addDomListener(window, 'load', initialize);