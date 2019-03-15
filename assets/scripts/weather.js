function weatherSearch(latitude, longitude) {
  var APIKey = "166a433c57516f51dfab1f7edaed8413";

  // Here we are building the URL we need to query the database
  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude + "&lon=" + longitude + "&appid=" + APIKey;
  var weatherIcon = {
    "Thunderstorm": "fas fa-bolt weathericon",
    "Drizzle": "fas fa-cloud-rain weathericon",
     "Rain": "fas fa-cloud-showers-heavy weathericon",
     "Snow": "fas fa-snowflake weathericon",
     "Atmosphere": "fas fa-smog weathericon",
     "Clear": "fas fa-sun weathericon",
     "Clouds": "fas fa-cloud-sun weathericon"
  }
  // Here we run our AJAX call to the OpenWeatherMap API    
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function (response) {;

      // Function to convert from Kelvin to Fahrenheit and post it
      function kelvinConverter() {
        var weatherTempNow = parseInt(((response.list[0].main.temp - 273.15) * 1.8) + 32);
        $("#weatherTempNow").prepend(weatherTempNow);
        var weatherTemp3 = parseInt(((response.list[1].main.temp - 273.15) * 1.8) + 32);
        $("#weatherTemp3").prepend(weatherTemp3);
        var weatherTemp6 = parseInt(((response.list[2].main.temp - 273.15) * 1.8) + 32);
        $("#weatherTemp6").prepend(weatherTemp6);
        var weatherTemp9 = parseInt(((response.list[3].main.temp - 273.15) * 1.8) + 32);
        $("#weatherTemp9").prepend(weatherTemp9);
        var weatherTemp12 = parseInt(((response.list[4].main.temp - 273.15) * 1.8) + 32);
        $("#weatherTemp12").prepend(weatherTemp12);
      }

      // Function to pull the type of weather and post it
      function getWeatherType() {
        var weatherNow = response.list[0].weather[0].main;
        $('#weather').append(`<div class="col col-md-1 mx-auto weatherbox"><h6>Now</h6><div id="weatherNow"><i class="${weatherIcon[weatherNow]}"></i></div><h3 id="weatherTempNow">&#8457</h3></div>`);
        var weather3 = response.list[1].weather[0].main;
        $('#weather').append(`<div class="col col-md-1 mx-auto weatherbox"><h6>3 hours</h6><div id="weather3"><i class="${weatherIcon[weather3]}"></i></div><h3 id="weatherTemp3">&#8457</h3></div>`);
        var weather6 = response.list[2].weather[0].main;
        $('#weather').append(`<div class="col col-md-1 mx-auto weatherbox"><h6>6 hours</h6><div id="weather6"><i class="${weatherIcon[weather6]}"></i></div><h3 id="weatherTemp6">&#8457</h3></div>`);
        var weather9 = response.list[3].weather[0].main;
        $('#weather').append(`<div class="col col-md-1 mx-auto weatherbox"><h6>9 hours</h6><div id="weather9"><i class="${weatherIcon[weather9]}"></i></div><h3 id="weatherTemp9">&#8457</h3></div>`);
        var weather12 = response.list[4].weather[0].main;
        $('#weather').append(`<div class="col col-md-1 mx-auto weatherbox"><h6>12 hours</h6><div id="weather12"><i class="${weatherIcon[weather12]}"></i></div><h3 id="weatherTemp12">&#8457</h3></div>`);

      }

      getWeatherType();
      kelvinConverter();
    });
}