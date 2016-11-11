$( document ).ready( function() {

	if ( navigator.geolocation ) {
		navigator.geolocation.getCurrentPosition( function( position ) {

			// Yahoo's API URL 
			var yqlurl = "https://query.yahooapis.com/v1/public/yql?callback=?";

			// Query string
			var q = "select * from weather.forecast where u='c' and woeid in" + 
					"(select woeid from geo.places where text='" + "(" + 
					position.coords.latitude + ", " + position.coords.longitude 
					+ ")')";

			var req = {
				q: q.toString(),
				format: "json",
			}

			// Get data
			$.getJSON(yqlurl, req).done( function( data ) {

				let chn = data.query.results.channel
				let loc = chn.location;
				$( "#title" ).html( "The current weather in " + loc.city
					+ ", " + loc.region + ", " + loc.country);
				
				// Temperature is in ºC, calculate to show in ºF
				var tempCelcius = chn.item.condition.temp;
				var tempFahren = Math.floor(tempCelcius * 1.8 + 32);
        
        // Show temperature in Celcius ( default )
        $( "#temp" ).html( tempCelcius + "º" );

        // Temp switch: shows temp in unit selected
        $( 'input:radio[name=scale]' ).change( function() {

				  if ( this.value == 'farenheit' ) {
				    $( "#temp" ).html( tempFahren + "º" );

				  } else if ( this.value == "centigrades" ) {
				  	$( "#temp" ).html( tempCelcius + "º" );
				  }
				});

				// Add values to every info div
				$( "#descrip" ).html( chn.item.condition.text );

				let pressure = Math.round(parseFloat(chn.atmosphere.pressure) / 33.85);
				$( "#pressure #value" ).html( pressure + " hPa" );
				$( "#humid #value" ).html( chn.atmosphere.humidity + "%" );
				$( "#wind #value" ).html( chn.wind.speed + " km/h" );

				// Wind direction icon
				$( "#wind" ).append( $( "<i class='wi wi-wind towards-" 
					+ chn.wind.direction + "-deg'></i>" ) );

				$( "#visibility #value" ).html( chn.atmosphere.visibility + " kms" );
				$( "#sunrise #value" ).html( chn.astronomy.sunrise );
				$( "#sunset #value" ).html( chn.astronomy.sunset );
				

				var sunrise = Date.parse(chn.lastBuildDate.slice(0, -13) 
					+ " " + chn.astronomy.sunrise);
				var sunset = Date.parse(chn.lastBuildDate.slice(0, -13) 
					+ " " + chn.astronomy.sunset);

				// Wheather icon

				// Check if it is day or night
				let now = ( Date.now() >= sunrise && Date.now() <= sunset ) ? "day" : "night";

				// Weather condition ID
				let id = chn.item.condition.code;

				// Add day or night icon for current weather
				if ($.inArray(id, ['2', '19', '20', '21', '22', '23', '24', '25', '26',
				 '27', '28', '29', '30', '31', '32', '33', '34', '36', '44']) == -1 ) {

					$( "#icon" ).append( icon( id, now) );
				} else {
					$( "#icon" ).append( $( "<i class='wi wi-yahoo-" + id + "'></i>" ) );
				}
				
				let grad = background( id, now );

				// Change container backgroud and text color depending on weather
				$( ".container" ).css( { 
					"background" : grad,  
					"color" : ( now == "night" ) ? "#ccc" : "#000"} );
		
			});
		});
	};
});

// Return container background depending on weather
function background( id, now ) {
	// Clear day
	if ( id == "32" || id == "34" ) {
		return "linear-gradient( to bottom, #0056b5 0%, #3b90e3 50%, #8fcef9 100% )";

	// Clear night
	} else if ( id == "31" || id == "33" ) {
		return "#000";

	// Cloudy
	} else if ( $.inArray( id, ["26", "27", "28", "30", "44", "29"]) != -1 ) {

		if (now = "night") {
			return "linear-gradient( to bottom, #4f3d3d 0%, #2d2323 17%, #000000 58% )";
		} else {
			return "linear-gradient( to bottom, #768d96 0%, #cedce7 100% )";
		}

	// Misty - Hazy
	} else if ( $.inArray( id, ["19", "20", "21", "22", "23"]) != -1) {

		if (now == "night") {
			return "linear-gradient( to bottom, #0e0e0e 0%, #383838 100% )";
		} else {
			return "linear-gradient( to bottom, #a3adb2 0%,#a3aeb0 8%,#a1aaad 25%," 
					+ "#a2a8ac 45%,#a1a8a8 50%,#9aa0a3 75%,#95979b 91%,#8e9295 100% )";
		}

	// Rain - Drizzle - Snow
	} else if ( $.inArray(id, ["0", "1", "2", "5", "6", "7", "8", "9", "10", "11", "12",
			"13", "14", "15", "16", "17", "18", "35", "40", "41", "42", "43", "46"]) != -1) {

		if (now == "night") {
			return "linear-gradient( to bottom, #2b0d0d 0%, #1c0808 26%, #0e0e0e 58% )";
		} else {
			return "linear-gradient( to bottom, #384349 0%, #828c95 64%, #b5bdc8 100% )";
		}

	// Thunderstorm
	} else if ( $.inArray(id, ["3", "4", "37", "38", "39", "45", "47"]) != -1 ) {

		if (now == "night") {
			return "linear-gradient( to bottom, #4c3a56 0%, #2c273a 24%, #0e0e0e 64% )";
		} else {
			return "linear-gradient( to bottom, #2d3e47 0%, #828c95 64%, #a3adb2 100% )";
		}
	}
};

// Return day/night icon
function icon ( id, now ) {
	if ( ($.inArray(id, ["1", "37", "38", "39", "45", "47"]) != -1 ) ) {
		return ( $( "<i class='wi wi-" + now + "-storm-showers'></i>" ) );

	} else if ( ($.inArray(id, ["3", "4"]) != -1 ) ) {
		return ( $( "<i class='wi wi-" + now + "-thunderstorm'></i>" ) );

	} else if ( ($.inArray(id, ["5", "6", "7", "18", "35"]) != -1 ) ) {
		return ( $( "<i class='wi wi-" + now + "-rain-mix'></i>" ) );

	} else if ( ($.inArray(id, ["8", "10", "17"]) != -1 ) ) {
		return ( $( "<i class='wi wi-" + now + "-hail'></i>" ) );

	} else if ( ($.inArray(id, ["9", "10", "11", "12", "40"]) != -1 ) ) {
		return ( $( "<i class='wi wi-" + now + "-showers'></i>" ) );

	} else if ( ($.inArray(id, ["13", "14", "16", "42", "46"]) != -1 ) ) {
		return ( $( "<i class='wi wi-" + now + "-snow'></i>" ) );

	} else if ( ($.inArray(id, ["15", "41", "43"]) != -1 ) ) {
		return ( $( "<i class='wi wi-" + now + "-snow-wind'></i>" ) );

	} else if ( id == "20" ) {
		return ( $( "<i class='wi wi-" + now + "-fog'></i>" ) );

	} else if ( id == "26" ) {
		return ( $( "<i class='wi wi-" + now + "-cloudy'></i>" ) );	

	} else if ( id == "21" && now == "day" ) {
		return ( $( "<i class='wi wi-" + now + "-windy'></i>" ) );

	} else {
		return ( $( "<i class='wi wi-windy'></i>" ) );
	}
};