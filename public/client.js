numberofteleportations = 1;

function clearDiv(div) {
	document.getElementById(div).innerHTML = "";
}

function writeToScreen(text, leg, div) {
	previoustext = document.getElementById(div).innerHTML;
	document.getElementById(div).innerHTML = previoustext + " + " + text;
}

function writeLegTally(tally, leg) {
	document.querySelector("#"+leg).getElementsByClassName('tally').innerHTML = tally;
}

function newTeleportation() {

	var teleportationgroup = document.createElement('div');
	teleportationgroup.setAttribute("id","leg"+numberofteleportations);
	document.querySelector('body').appendChild(teleportationgroup);

	var from = document.createElement('input');
	from.setAttribute("class", "from");
	from.setAttribute("autofocus", "true");
	from.setAttribute("spellcheck", "false");
	from.setAttribute("placeholder", "From..");
	document.querySelector("#leg"+numberofteleportations).appendChild(from);

	var to = document.createElement('input');
	to.setAttribute("class", "to");
	// textarea.setAttribute("autofocus", "true");
	to.setAttribute("spellcheck", "false");
	to.setAttribute("placeholder", "To..");
	to.addEventListener("keypress", function(e){ 
			// if the key is return
			if(e.keyCode === 13){
				query();
			}
		});
	
	document.querySelector("#leg"+numberofteleportations).appendChild(to);
	numberofteleportations += 1;


	var tally = document.createElement('div');
	tally.setAttribute("id","tally");
	document.querySelector("#leg"+numberofteleportations).appendChild(tally);
}

function main() {
	
	newTeleportation();

	var score = document.createElement('div');
	score.setAttribute("id", "feedback");
	score.innerHTML = "";
	document.querySelector('body').appendChild(score);


	ws = io.connect()
	ws.on('distance', function(distance){
		writeToScreen(distance, 'feedback');
	});

}

function query() {
	clearDiv("feedback");
	var query = [];
	for(var i=1; i<numberofteleportations; i++) {
		var leg = "leg"+i;		
		var from = document.querySelector("#"+leg).getElementsByClassName('from')[0].value;
		var to = document.querySelector("#"+leg).getElementsByClassName('to')[0].value;
		query.push([leg, from, to]);
	}
	console.log(query);
	ws.emit("query", query);
}

main();
