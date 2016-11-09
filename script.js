$( document ).ready( function() {
	var link = "";

	if ( navigator.geolocation ) {
		navigator.geolocation.getCurrentPosition( function( position ) {
			
			link = "http://api.openweathermap.org/data/2.5/weather?lat="
				+ position.coords.latitude + "&lon="
				+ position.coords.longitude
				+ "&APPID=edc5b16dc0d6c74d9dcf127345773105";
			
			// For test
			/*
			link = "http://api.openweathermap.org/data/2.5/weather?lat="
				+ 64 + "&lon=" + 22.5
				+ "&APPID=edc5b16dc0d6c74d9dcf127345773105";
			*/

			link = "weatherfile.json";

			$.getJSON( link, function( data ) {

				$( "#title" ).html( "The current weather in " + data.name );
				
				// Temperature is in Kelvin, calculate to show in ºC and ºF
				var tempCelcius = Math.floor( data.main.temp - 273 );
        var tempFahren = Math.floor( ( 1.8 * tempCelcius ) + 32 );
        
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
				let desc = data.weather[0].description;
				$( "#descrip" ).html( desc[0].toUpperCase() + desc.slice( 1 ) );
				$( "#pressure #value" ).html( data.main.pressure + " hPa" );
				$( "#humid #value" ).html( data.main.humidity + "%" );
				$( "#wind #value" ).html( data.wind.speed + "m/s  " );

				// Wind direction icon
				$( "#wind" ).append( $( "<i class='wi wi-wind towards-" 
					+ Math.floor( data.wind.deg ).toString() + "-deg'></i>" ) );

				$( "#clouds #value" ).html( data.clouds.all + "%" );
				var sunrise = new Date( data.sys.sunrise * 1000 );
				var sunset = new Date( data.sys.sunset * 1000 );
				$( "#sunrise #value" ).html( sunrise.toTimeString().slice( 0,8 ) + " Hs" );
				$( "#sunset #value" ).html( sunset.toTimeString().slice( 0,8 ) + " Hs" );
				

				// Wheather icon

				// Check if it is day or night
				let now = ( Date.now() >= sunrise && Date.now() <= sunset ) ? "day" : "night";

				// Build weather condition ID
				let id = now + "-" + data.weather[0].id.toString();

				// Add day or night icon for current weather
				$( "#icon" ).append( $( "<i class='wi wi-owm-" + id + "'></i>" ) );


				// Add rain or snow info if any:
				if ( data.rain != undefined ) {

					var rain = data.rain["3h"] + "mm";
					$( "#rainsnow" ).html( "Rain 3H: " + rain );

				} else if ( data.snow != undefined ) {

					var snow = snow.rain["3h"] + "mm";
					$( "#rainsnow" ).html( "Snow 3H: " + snow );
				}
				

				// Return container background depending on weather
				function background( id ) {
					// Clear day
					if ( id == "day-800" ) {
						return "linear-gradient( to bottom, #0056b5 0%, #3b90e3 50%, #8fcef9 100% )";

					// Clear night
					} else if ( id == "night-800" ) {
						return "#000";

					// Cloudy day
					} else if ( id.slice( 0, -2 ) == "day-8" ) {
						return "linear-gradient( to bottom, #768d96 0%, #cedce7 100% )";

					// Cloudy night
					} else if ( id.slice( 0, -2 ) == "night-8" ) {
						return "linear-gradient( to bottom, #4f3d3d 0%,#2d2323 17%,#000000 58% )";

					// Misty - Hazy day 
					} else if ( id.slice( 0, -2 ) == "day-7" ) {
						return "linear-gradient( to bottom, #a3adb2 0%,#a3aeb0 8%,#a1aaad 25%," 
							+ "#a2a8ac 45%,#a1a8a8 50%,#9aa0a3 75%,#95979b 91%,#8e9295 100% )";

					// Misty - Hazy night
					} else if ( id.slice( 0, -2 ) == "night-7" ) {
						return "linear-gradient( to bottom, #0e0e0e 0%,#383838 100% )";

					// Rain - Drizzle - Snow day
					} else if ( id.slice( 0, -2 ) == "day-3" || id.slice( 0, -2 ) == "day-5"
						|| id.slice( 0, -2 ) == "day-6" ) {
						return "linear-gradient( to bottom, #384349 0%,#828c95 64%,#b5bdc8 100% )";

					// Rain - Drizzle - Snow night
					} else if ( id.slice( 0, -2 ) == "night-3" || id.slice( 0, -2 ) == "night-5"
						|| id.slice( 0, -2 ) == "night-6" ) {
						return "linear-gradient( to bottom, #2b0d0d 0%,#1c0808 26%,#0e0e0e 58% )";

					// Thunderstorm day
					} else if ( id.slice( 0, -2 ) == "day-2" ) {
						return "linear-gradient( to bottom, #2d3e47 0%,#828c95 64%,#a3adb2 100% )";

					// Thunderstorm night
					} else if ( id.slice( 0, -2 ) == "night-2" ) {
						return "linear-gradient( to bottom, #4c3a56 0%,#2c273a 24%,#0e0e0e 64% )";
					}
				};

				let grad = background( id );

				// Change container backgroud and text color depending on weather
				$( ".container" ).css( { 
					"background" : grad,  
					"color" : ( id.slice( 0, 1 ) == "n" ) ? "#ccc" : "#000"} );

			});
		});
	};
});