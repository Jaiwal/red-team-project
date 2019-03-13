$(document).ready(function () {
    let map, infobox
    const getPlaces = (location, section = 'topPicks') => {
        const fourSquareURL = 'https://api.foursquare.com/v2/venues/explore?limit=12&v=20190307&client_id=VSKZRJ3CZT5J0WQK2AEAPSP254O4SJAUEE1WVASQSY4NCSBR&client_secret=OTQKUUM5KKMFALEKGS3RYRZUD1OGRIC0GV4YCDTCI3KWOSLR&ll=';
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
            zoom: 17,
            // mapTypeId: Microsoft.Maps.MapTypeId.canvasDark,
            // customMapStyle: {
            //     elements: {
            //         street: {
            //             fillColor: '#8c7b79',
            //         },
            //         water: {
            //             fillColor: '#4D76B2'
            //         },
            //         highway: {
            //             fillColor: '#8FA9CC'
            //         },
            //         road: {
            //             fillColor: '#403F4C',
            //             strokeColor: '#ccc'
            //         },
            //         vegetation: {
            //             fillColor: '#6C7F2A'
            //         },
            //         mapElement: {
            //             labelColor: '#fff',
            //             labelOutlineColor: '#666'
            //         }
            //     },
            //     settings: {
            //         landColor: '#51637E'
            //     }
            // }
        });
        infobox = new Microsoft.Maps.Infobox(map.getCenter(), {
            visible: false,
        });
        infobox.setMap(map);
        let pin = new Microsoft.Maps.Pushpin(mapTarget, { title: 'You are Here', color: 'red', draggable: true })
        map.entities.push(pin);
        Microsoft.Maps.loadModule('Microsoft.Maps.Traffic', function () {
            trafficManager = new Microsoft.Maps.Traffic.TrafficManager(map);
            trafficManager.show();
        });
    }

    const ppClicked = (venueid, name) => {
        $('.active').removeClass('active');
        $(`li[data-id="${venueid}"]`).addClass('active');
        let url = `https://api.foursquare.com/v2/venues/${venueid}?client_id=VSKZRJ3CZT5J0WQK2AEAPSP254O4SJAUEE1WVASQSY4NCSBR&client_secret=OTQKUUM5KKMFALEKGS3RYRZUD1OGRIC0GV4YCDTCI3KWOSLR&v=20190307`
        $.ajax({
            url: url,
            method: 'GET'
        }).then(response => {
            let photoURL = response.response.venue.bestPhoto.prefix + '300x300' + response.response.venue.bestPhoto.suffix;
            let timeframes = response.response.venue.popular.timeframes;
            let hours = '';
            if (!timeframes) {
                hours = '<table>'
                response.response.venue.popular.timeframes.forEach(e => {
                    hours += `<tr><td>${e.days}</td><td>${e.open[0].renderedTime}</td><tr>`
                });
                hours += '</table>';
            }

            let venueLocation = new Microsoft.Maps.Location(response.response.venue.location.lat, response.response.venue.location.lng);
            map.setView({
                center: venueLocation
            })
            let title = name;
            let description = `<div><img src="${photoURL}" alt="${name} photo"/></div> ${hours}`;
            infobox.setOptions({
                location: venueLocation,
                title: title,
                maxWidth: 400,
                maxHeight: 600,
                description: description,
                visible: true
            })
            $('.infobox-body').attr('style', 'width: auto;');
        })
    }

    const updateUI = () => {
        $('h1').remove();
        $('.jumbotron').attr('class', 'navbar');
        $('#weather').remove();
        $('#results').remove();
        $('body').append('<div class="row" id="weather">');
        $('body').append('<div class="row no-gutters" id="results">');
        $('#results').append('<div class="col-4"><ul class="list-group"></div><div class="col-8"><div id="map"></div></div>')
    }

    const search = (query, section) => {
        updateUI();
        geoCode(query).then(response => {
            try {
                let llarr = response.resourceSets[0].resources[0].geocodePoints[0].coordinates;
                let ll = llarr.toString().replace(',', '%2C');
                getMap(llarr);
                getPlaces(ll, section).then(response => {//replace with call to updated places UI
                    let layer = new Microsoft.Maps.Layer();
                    let pins = [];
                    let pinsbg = [];
                    response.response.groups[0].items.forEach(e => {
                        $('.list-group').append(`<li class="list-group-item list-group-item-action" data-id="${e.venue.id}" data-name="${e.venue.name}">${e.venue.name} <span class="info""></span></li>`)
                        let place = new Microsoft.Maps.Location(e.venue.location.lat, e.venue.location.lng);
                        let pbg = new Microsoft.Maps.Pushpin(place, {
                            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAMUlEQVRYR+3QQREAAAjDMOZt/i2BDD6pgl7SduexGCBAgAABAgQIECBAgAABAgS+BQ6OUzmBVuXhXAAAAABJRU5ErkJggg=='
                        });
                        //map.entities.push(pbg);
                        pinsbg.push(pbg);
                        let pin = new Microsoft.Maps.Pushpin(place, {
                            title: e.venue.name,
                            icon: e.venue.categories[0].icon.prefix + '32' + e.venue.categories[0].icon.suffix
                        });

                        pin.metadata = {
                            title: e.venue.name,
                            venueID: e.venue.id
                        }
                        Microsoft.Maps.Events.addHandler(pin, 'click', function (e) {
                            ppClicked(e.target.metadata.venueID, e.target.metadata.title)
                        });
                        //map.entities.push(pin);
                        pins.push(pin);
                    })
                    map.entities.push(pinsbg);
                    layer.add(pins);
                    map.layers.insert(layer);
                })
            } catch (e) {
                $('#stuff').text('Sorry, no results found');
            }
        })
    }

    $('form').submit(function (e) {
        e.preventDefault();
        let location = $('#locationsearch').val();
        if (!$('input:radio[name="categories"]:checked').val()) {
            search(location)
        } else {
            search(location, $('input:radio[name="categories"]:checked').val())
        }
    })
    $('#locate').on('click', function () {
        let location = '';
        window.navigator.geolocation.getCurrentPosition(response => {
            location = response.coords.latitude + ',' + response.coords.longitude;

            search(location);
        });
    })
    $('body').on('click', 'li', function () {
        ppClicked($(this).attr('data-id'), $(this).attr('data-name'));
    });
})