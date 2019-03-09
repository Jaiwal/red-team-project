const getPlaces = (location, section = 'topPicks') => {
    const fourSquareURL = 'https://api.foursquare.com/v2/venues/explore?v=20190307&client_id=VSKZRJ3CZT5J0WQK2AEAPSP254O4SJAUEE1WVASQSY4NCSBR&client_secret=OTQKUUM5KKMFALEKGS3RYRZUD1OGRIC0GV4YCDTCI3KWOSLR&ll=';
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

$('button').on('click', function () {
    $('#stuff').empty();
    geoCode($('input').val())
        .then(response => {
            let ll = response.resourceSets[0].resources[0].geocodePoints[0].coordinates.toString();
            getPlaces(ll).then(response => {
                console.log(response)
                response.response.groups[0].items.forEach(e => {
                    $('#stuff').append(`<p>${e.venue.name}</p>`)
                })
            })
            //.then do something
            //get weather call too
        });
})