const getPlaces = (location, section = 'topPicks') => {
    const fourSquareURL = 'https://api.foursquare.com/v2/venues/explore?limit=50&v=20190307&client_id=VSKZRJ3CZT5J0WQK2AEAPSP254O4SJAUEE1WVASQSY4NCSBR&client_secret=OTQKUUM5KKMFALEKGS3RYRZUD1OGRIC0GV4YCDTCI3KWOSLR&ll=';
    return $.ajax({
        url: fourSquareURL + location + '&section=' + section,
        method: 'GET'
    })
}

const geoCode = async query => {
    const geocodeURL = 'https://dev.virtualearth.net/REST/v1/Locations/?maxResults=1&&key=Ao5GBZzTBhN_P14V5wnkRm5gX7oxMjW47tpMlDtE_qVc16qRn7ElPOlM3IxfzPQM&query='
    return $.ajax({
        url: geocodeURL + query,
        method: 'GET'
    })
}

const search = query => {
    $('#stuff').empty();
    geoCode(query)
        .then(response => {
            try {
            let ll = response.resourceSets[0].resources[0].geocodePoints[0].coordinates.toString().replace(',', '%2C');
            getPlaces(ll).then(response => {//replace with call to updated places UI
                response.response.groups[0].items.forEach(e => {
                    $('#stuff').append(`<div><a href="https://www.google.com/maps/search/?api=1&query=${e.venue.location.lat + '%2C' + e.venue.location.lng}" target="_blank">${e.venue.name}</a><img src="${e.venue.categories[0].icon.prefix + '32' + e.venue.categories[0].icon.suffix}" alt="Photo of ${e.venue.name}"/></div>`)
                })
            })
        } catch {
            $('#stuff').text('Sorry, no results found');
        }
            //.then do something
            //get weather call too
        });
    }

$('#search').on('click', function () {
    let location = $('input').val(); 
    search(location) 
})
$('#locate').on('click', function () {
    let location = '';
    window.navigator.geolocation.getCurrentPosition(response => {
        location = response.coords.latitude + ',' + response.coords.longitude;
        search(location);
    });
    
})

//https://dev.virtualearth.net/REST/v1/Imagery/Map/imagerySet/centerPoint/zoomLevel?mapSize={mapSize}&pushpin={pushpin}&mapLayer={mapLayer}&format={format}&mapMetadata={mapMetadata}&key={BingMapsAPIKey}