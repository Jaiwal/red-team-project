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
              var weatherTempNow = kelv[0];
              $("#weatherTempNow").append(weatherTempNow);
              // var weatherTemp3 = kelv[1];
              // $("#weatherTemp3").append(weatherTemp3);
              // var weatherTemp6 = kelv[2];
              // $("#weatherTemp6").append(weatherTemp6);
              // var weatherTemp9 = kelv[3];
              // $("#weatherTemp9").append(weatherTemp9);
              // var weatherTemp12 = kelv[4];
              // $("#weatherTemp12").append(weatherTemp12);
            }
          }
          
          
          function getWeatherType() {
            for (var i=0; i < 5; i++) {
              var weatherTypeArray = response.list[i].weather[0].main;
              console.log(weatherTypeArray);
              var weatherNow = weatherTypeArray[0];
              $("#weatherNow").append(weatherNow);
              // var weather3 = weatherTypeArray[1];
              // $("#weather3").append(weather3);
              // var weather6 = weatherTypeArray[2];
              // $("#weather6").append(weather6);
              // var weather9 = weatherTypeArray[3];
              // $("#weather9").append(weather9);
              // var weather12 = weatherTypeArray[4];
              // $("#weather12").append(weather12);
            }
          }
          kelvinConverter();
          getWeatherType();
        });
      // }

    });