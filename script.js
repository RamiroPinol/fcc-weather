$(document).ready(function() {
	var link = "";
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			link = "http://api.openweathermap.org/data/2.5/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&APPID=edc5b16dc0d6c74d9dcf127345773105";

			$.getJSON(link, function( data ) {

				$("#title").html("The current weather in " + data.name);
				
				//Wheather Icon
				var iconpath = "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
				$("#icon").attr({
					src: iconpath,
					alt: data.weather[0].description
				});
				

				var tempCelcius = Math.floor(data.main.temp - 273);
        			var tempFahren = Math.floor((1.8 * tempCelcius) + 32);
        			

        			$("#temp").html(tempCelcius + "º");

        			//Initialize Switch
        			$("[id='tempSwitch']").bootstrapSwitch();

        			$('input[id="tempSwitch"]').on('switchChange.bootstrapSwitch', function(event, state) {
          			if(state){
               			$("#temp").html(tempCelcius + "º");
            		} else {
               			$("#temp").html(tempFahren + "º");
            		}
				});
				

				$("#descrip").html(data.weather[0].main);
				$("#pressure").html(data.main.pressure + " hPa");
				$("#humid").html(data.main.humidity + "%");
				$("#wind").html(data.wind.speed + "m/s  " + Math.floor(data.wind.deg) + "º");
				$("#clouds").html(data.clouds.all + "%");
				var sunrise = new Date(data.sys.sunrise * 1000);
				var sunset = new Date(data.sys.sunset * 1000);
				$("#sunrise").html(sunrise.getHours() + ":" + sunrise.getMinutes() + ":" + sunrise.getSeconds());
				$("#sunset").html(sunset.getHours() + ":" + sunset.getMinutes() + ":" + sunset.getSeconds());

				//Add rain or snow info if any:
				if (data.rain["3h"]) {
					var rain = data.rain["3h"] + " mm";
					$("#rain_snow_title").html("RAIN 3H");
					$("#rain_snow").html(rain);
				} else if (data.snow["3h"]) {
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