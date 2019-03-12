$(document).ready(function () {
    
    var APIKey = "166a433c57516f51dfab1f7edaed8413";

    // Coordinates for PDX
    var latitude = 45.516022;
    var longitude = -122.681427;
    
    // Here we are building the URL we need to query the database
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&appid="+APIKey;


    // Here we run our AJAX call to the OpenWeatherMap API
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function(response) {
        console.log(queryURL);
        console.log(response);

      });

    });