$(document).ready(function() {
	var link = "";

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {

			link = "http://api.openweathermap.org/data/2.5/weather?lat="
				+ position.coords.latitude + "&lon="
				+ position.coords.longitude
				+ "&APPID=edc5b16dc0d6c74d9dcf127345773105";
			//link = "weather.json";

			$.getJSON(link, function( data ) {

				$("#title").html("The current weather in " + data.name);
				
				// Temperature is in Kelvin, calculate to show in ºC and ºF
				var tempCelcius = Math.floor(data.main.temp - 273);
        var tempFahren = Math.floor((1.8 * tempCelcius) + 32);
        
        // Show temperature in Celcius (default)
        $("#temp").html(tempCelcius + "º");

        // Temp switch: shows temp in unit selected
        $('input:radio[name=scale]').change(function() {
				  if (this.value == 'farenheit') {
				    $("#temp").html(tempFahren + "º");
				  } else if (this.value == "centigrades") {
				  	$("#temp").html(tempCelcius + "º");
				  }
				});

				// Add values to every info div
				let desc = data.weather[0].description;
				$("#descrip").html(desc[0].toUpperCase() + desc.slice(1));
				$("#pressure #value").html(data.main.pressure + " hPa");
				$("#humid #value").html(data.main.humidity + "%");
				$("#wind #value").html(data.wind.speed + "m/s  ");

				// Wind direction icon
				$("#wind").append($("<i class='wi wi-wind towards-" 
					+ Math.floor(data.wind.deg).toString() + "-deg'></i>"));

				$("#clouds #value").html(data.clouds.all + "%");
				var sunrise = new Date(data.sys.sunrise * 1000);
				var sunset = new Date(data.sys.sunset * 1000);
				$("#sunrise #value").html(sunrise.toTimeString().slice(0,8) + " Hs");
				$("#sunset #value").html(sunset.toTimeString().slice(0,8) + " Hs");
				

				// Wheather icon

				// Check if it is day or night
				let now = (Date.now() >= sunrise && Date.now() <= sunset) ? "day" : "night";

				// Add day or night icon for current weather
				$("#icon").append($("<i class='wi wi-owm-" + now + "-"
					+ data.weather[0].id.toString() + "'></i>"));


				//Add rain or snow info if any:
				if (data.rain != undefined) {
					var rain = data.rain["3h"] + " mm";
					$("#rain_snow_title").html("RAIN 3H");
					$("#rain_snow").html(rain);
				} else if (data.snow != undefined) {
					var snow = snow.rain["3h"] + " mm";
					$("#rain_snow_title").html("SNOW 3H");
					$("#rain_snow").html(snow);
				}
				
				//Cambiar background
				if (data.weather[0].main == "Clouds") {
					$("html body").animate({backgroundColor: "red"}, 500);
				};
			});
	
		});
	};

});