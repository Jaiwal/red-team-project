let map, infobox
const getPlaces = (location, section = 'topPicks') => {
    const fourSquareURL = 'https://api.foursquare.com/v2/venues/explore?limit=20&v=20190307&client_id=VSKZRJ3CZT5J0WQK2AEAPSP254O4SJAUEE1WVASQSY4NCSBR&client_secret=OTQKUUM5KKMFALEKGS3RYRZUD1OGRIC0GV4YCDTCI3KWOSLR&ll=';
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

const getMap = ll => {
    let mapTarget = new Microsoft.Maps.Location(ll[0], ll[1]);
    map = new Microsoft.Maps.Map('#map', {
        credentials: 'Ao5GBZzTBhN_P14V5wnkRm5gX7oxMjW47tpMlDtE_qVc16qRn7ElPOlM3IxfzPQM',
        center: mapTarget,
        zoom: 15,
       mapTypeId: Microsoft.Maps.MapTypeId.canvasDark,
        customMapStyle: {
            elements: {
                street: {
                    fillColor: '#8c7b79',
                },
                water: {
                    fillColor: '#4D76B2'
                },
                highway: {
                    fillColor: '#8FA9CC'
                },
                road: {
                    fillColor: '#403F4C',
                    strokeColor: '#ccc'
                },
                vegetation: {
                    fillColor: '#6C7F2A'
                },
                mapElement: {
                    labelColor: '#fff',
                    labelOutlineColor: '#666'
                }
            },
            settings: {
                landColor: '#51637E'
             }
        }
    });
    infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
        visible: false,
    });
    infobox.setMap(map);
    let pin = new Microsoft.Maps.Pushpin(mapTarget, { title: 'You are Here', color: 'red', draggable: true})
    map.entities.push(pin);
    Microsoft.Maps.loadModule('Microsoft.Maps.Traffic', function () {
        trafficManager = new Microsoft.Maps.Traffic.TrafficManager(map);
        trafficManager.show();
    });
}

const ppClicked = (e) => {
    let url = `https://api.foursquare.com/v2/venues/${e.target.metadata.venueID}?client_id=VSKZRJ3CZT5J0WQK2AEAPSP254O4SJAUEE1WVASQSY4NCSBR&client_secret=OTQKUUM5KKMFALEKGS3RYRZUD1OGRIC0GV4YCDTCI3KWOSLR&v=20190307`
    $.ajax({
        url: url,
        method: 'GET'
    }).then(response => {
        let photoURL = response.response.venue.bestPhoto.prefix + '300x300' + response.response.venue.bestPhoto.suffix;
        let hours = '<table>'
        response.response.venue.popular.timeframes.forEach(e => {
            hours += `<tr><td>${e.days}</td><td>${e.open[0].renderedTime}</td><tr>`
        });
        hours += '</table>';
        let venueLocation = new Microsoft.Maps.Location(response.response.venue.location.lat, response.response.venue.location.lng);
        map.setView({
            center: venueLocation
        })
        let title = e.target.metadata.title;
        let description = `<div><img src="${photoURL}" alt="${e.target.metadata.title} photo"/></div> ${hours}`;
        infobox.setOptions({
            location: e.target.getLocation(),
            title: title,
            maxWidth: 400,
            maxHeight: 600,
            description: description,
            visible: true
        })
        $('.infobox-body').attr('style', 'width: auto;');
    })
}

const search = query => {
    $('#stuff').empty();
    geoCode(query).then(response => {
        try {
            let llarr = response.resourceSets[0].resources[0].geocodePoints[0].coordinates;
            let ll = llarr.toString().replace(',', '%2C');
            getPlaces(ll).then(response => {//replace with call to updated places UI
                response.response.groups[0].items.forEach(e => {
                    $('#stuff').append(`<div><a href="https://www.google.com/maps/search/?api=1&query=${e.venue.location.lat + '%2C' + e.venue.location.lng}" target="_blank">${e.venue.name}</a><span class="info"></span></div>`)
                    let place = new Microsoft.Maps.Location(e.venue.location.lat, e.venue.location.lng);
                    let pin = new Microsoft.Maps.Pushpin(place, {
                        title: e.venue.name,
                        icon: e.venue.categories[0].icon.prefix + '32' + e.venue.categories[0].icon.suffix
                    });
                    pin.metadata = {
                        title: e.venue.name,
                        venueID: e.venue.id
                    }
                    Microsoft.Maps.Events.addHandler(pin, 'click', ppClicked);
                    map.entities.push(pin);
                })
            })
            getMap(llarr);
        } catch (e) {
            $('#stuff').text('Sorry, no results found');
        }
    })
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
