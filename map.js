function initialize() {
	
	var mapOptions = {
		center: new google.maps.LatLng(40.72078,-74.001119),
		zoom: 16,
		};

	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	var directionstorequest = {
		origin: "rockefeller center",
		destination: "times square",
		travelMode: google.maps.TravelMode.WALKING,
		region: "US"
	}

	var directionsService = new google.maps.DirectionsService;
	directionsService.route(directionstorequest, mapDirections);

	function mapDirections(DirectionsResult, DirectionsStatus) {
		if (DirectionsStatus != "OK") {
			alert(DirectionsStatus);
		}
		else {
			renderer = new google.maps.DirectionsRenderer();
			renderer.setMap(map);
			renderer.setDirections(DirectionsResult);

			if(DirectionsResult.routes[0].legs) {
				var time = 0;
				for (var i=0; i<DirectionsResult.routes[0].legs.length; i++) {
					console.log(DirectionsResult.routes[0].legs[i].duration.value);
					time += DirectionsResult.routes[0].legs[i].duration.value;
				}
				document.getElementById("time").innerText = time;
				console.log()	
			}
		}
	}


	var polyOptions = {
	   strokeColor: '#000000',
	   strokeOpacity: 1.0,
	   strokeWeight: 3
	};
	poly = new google.maps.Polyline(polyOptions);
	poly.setMap(map);

	// Add a listener for the click event
	google.maps.event.addListener(map, 'click', addLatLng);

	function addLatLng(event) {

	  var path = poly.getPath();

	  // Because path is an MVCArray, we can simply append a new coordinate
	  // and it will automatically appear.
	  path.push(event.latLng);

	  // Add a new marker at the new plotted point on the polyline.
	  var marker = new google.maps.Marker({
	    position: event.latLng,
	    title: '#' + path.getLength(),
	    map: map
	  });
	}
}

google.maps.event.addDomListener(window, 'load', initialize);