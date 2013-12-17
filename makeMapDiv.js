
//=========
function makeMapDiv(number, from, to) {
	var mapGroup = document.createElement('div');
	mapGroup.setAttribute("id","group"+number);
	document.querySelector('body').appendChild(mapGroup);

	var from = document.createElement('input');
	from.setAttribute("class", "from");
	from.setAttribute("autofocus", "true");
	from.setAttribute("spellcheck", "false");
	if(from) {
		from.setAttribute("placeholder", from);
	}
	else {
		from.setAttribute("placeholder", "From..");
	}
	document.querySelector("#group"+number).appendChild(from);

	var to = document.createElement('input');
	to.setAttribute("class", "to");
	to.setAttribute("spellcheck", "false");
	if (to) {
		to.setAttribute("placeholder", to);
	}
	else {
		to.setAttribute("placeholder", "To..");
	}
	to.addEventListener("keypress", function(e){ 
			// if the key is return
			if(e.keyCode === 13){
				query();
			}
		});
	document.querySelector("#group"+number).appendChild(to);

	var mapDiv = document.createElement('div');
	mapDiv.setAttribute("class", "map");

	var time = document.createElement('div');
	time.setAttribute("class","time");
	document.querySelector("#group"+number).appendChild(time);

	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}


