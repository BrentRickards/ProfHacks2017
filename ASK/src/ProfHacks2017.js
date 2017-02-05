// App ID must be replaced
var APP_ID = undefined;

//The Alexa skill prototype and helper functions
var http = require('http');
var AlexaSkill = require('./AlexaSkill');

//Particle is a child of AlexaSkill
var Particle = function(){
	AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Particle.prototype = Object.create(AlexaSkill.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.eventhandlers.onSessionStarted = function (sessionStartedRequest, session){
	console.log("Particle onSessionStarted requestId: " + sessionStarted.requestId + ", sessionId: " + session.sessionId);
};

Particle.prototype.intentHandlers = {
	//register custom intent handlers
	ParticleIntent: function (intent, session, response) {
		var lightSlot = intent.slots.light;
		var onoffSlot = intent.slots.onoff;

		var light = lightSlot ? intent.slots.light.value : "";
		var onoff = onoffSlot ? intent.slots.onoff.value : "off";

		var speakText = "";

		console.log("Light = " + light);
		console.log("OnOff = " + onoff);

		var pin = "";
		var pinvalue = "";

		//REPLACE WITH ACTION DEVICE ID AND ACCESS TOKEN!!!!!!!!!!!!!
		var deviceid = "<<deviceid>>";
		var accessToken = "<<accessToken>>";

		var sparkHst = "api.particle.io";

		//Check slots and call Particle funcitons
		if (light == "red"){
			pin = "D0";
		}
		else if (light == "purple"){
			pin = "D1";
		}

		if (pin.length > 0){
			if(onoff == "on"){
				pinvalue = "HIGH";
			}
			else{
				pinvalue = "LOW";
			}

			var sparkPath = "/v1/devices" + deviceid + "/ctrlled";

			console.log("Path = " + sparkPath);

			var args = pin + "," + pinvalue;

			makeParticleRequest(sparkHst, sparkPath, args, accessToken, function(resp){
				var json = JSON.parse(resp);

				response .tellWithCard("OK, " + " light turned " + onoff, "Particle", "Particle!");
				response.ask("Continue?");
			});
		}
		else{
			response.tell("Sorry, I could not understand what you said");
		}
	},
	HelpIntent: function (intent, session, response){
		response.ask("You can tell me to turn on the red or purple light!");
	}
};

//Create handler that responds to Alexa request.
exports.handler = function (event, context){
	//Create an instance of the Particle skill
	var particleSkill = new Particle();
	particleSkill.execute(event, context);
};

function makeParticleRequest(hname, urlPath, args, accessToken, callback){
	//Particle API parameters
	var options = {
		hostname: hname,
		port: 443,
		path: urlPath,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Accept': '*.*'
		}
	}

	var postData = "access_token=" + accessToken + "&" + "args=" + args;
	
	console.log("Post Data: " + postData);

	//Call Particle apivar 
	req = http.request(options, functions(res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));

		var body = "";

		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('BODY: ' + chunk);

			body += chunk;
		});
	});

	req.on('error', function(e){
		console.log('problem with request: ' + e.message);
	});

	//write data to request body
	req.write(postData);
	req.end();
}