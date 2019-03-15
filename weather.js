$(document).ready(function () {
    function weatherSearch (latitude, longitude) {
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
          
          // Function to convert from Kelvin to Fahrenheit and post it
          function kelvinConverter() {
              var weatherTempNow = parseInt(((response.list[0].main.temp-273.15)*1.8)+32);
              $("#weatherTempNow").prepend(weatherTempNow);
              var weatherTemp3 = parseInt(((response.list[1].main.temp-273.15)*1.8)+32);
              $("#weatherTemp3").prepend(weatherTemp3);
              var weatherTemp6 = parseInt(((response.list[2].main.temp-273.15)*1.8)+32);
              $("#weatherTemp6").prepend(weatherTemp6);
              var weatherTemp9 = parseInt(((response.list[3].main.temp-273.15)*1.8)+32);
              $("#weatherTemp9").prepend(weatherTemp9);
              var weatherTemp12 = parseInt(((response.list[4].main.temp-273.15)*1.8)+32);
              $("#weatherTemp12").prepend(weatherTemp12);
          }
          
          // Function to pull the type of weather and post it
          function getWeatherType() {
              var weatherNow = response.list[0].weather[0].main;
              $("#weatherNow").append(weatherNow);
              var weather3 = response.list[1].weather[0].main;
              $("#weather3").append(weather3);
              var weather6 = response.list[2].weather[0].main;
              $("#weather6").append(weather6);
              var weather9 = response.list[3].weather[0].main;
              $("#weather9").append(weather9);
              var weather12 = response.list[4].weather[0].main;
              $("#weather12").append(weather12);           
          }

          function consoleViewing() {
            for (var i=0; i < 5; i++) {
              var weatherTypeArray = response.list[i].weather[0].main;
              console.log(weatherTypeArray);
              var fahr = parseInt(((response.list[i].main.temp-273.15)*1.8)+32);
              console.log(fahr);
            }
          }

          kelvinConverter();
          getWeatherType();
          consoleViewing();
        });
      }

    });