$(document).ready(function () {
    // function weatherSearch (latitude, longitude) {
      var APIKey = "166a433c57516f51dfab1f7edaed8413";

      // Coordinates for PDX for testing
      var latitude = 45.516022;
      var longitude = -122.681427;
      
      // Here we are building the URL we need to query the database
      var queryURL = "http://api.openweathermap.org/data/2.5/forecast?lat="+latitude+"&lon="+longitude+"&appid="+APIKey;

      // Here we run our AJAX call to the OpenWeatherMap API    
      $.ajax({
        url: queryURL,
        method: "GET"
      })
        .then(function(response) {
          console.log(queryURL);
          console.log(response);
          
          function kelvinConverter() {
            for (var i=0; i < 5; i++) {
              var kelv = response.list[i].main.temp;
              var fahr = parseInt(((kelv-273.15)*1.8)+32);
              console.log(fahr);
            }
          }
          
          function getWeatherType() {
            for (var i=0; i < 5; i++) {
              var weatherType = response.list[i].weather[0].main;
              console.log(weatherType);
              $().append(weatherType);
            }
          }
          kelvinConverter();
          getWeatherType();
        });
      // }

    });