$(document).ready(function() {
    resizeWindow();

    $(window).resize(function() {
        resizeWindow();
      });
})

var map;
var markers = [];

function resizeWindow(){
    width = $(window).width();
    height = $(window).height();

    $("#map").height(height).width(width);
}

function initMap() {
    // The location of Dallas
    var dallas = {lat: 32.80, lng: -96.80};
    // The map, centered at Dallas
    map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 11,
            center: dallas,
            mapTypeId: 'roadmap' // roadmap,satellite,terrain,hybrid
        });

<<<<<<< HEAD
    map.data.loadGeoJson('./js/demo_GeoJSON.js');

    // $.getJSON("./js/demo_GeoJSON.js", function(data){
    //     for (var i = 0; i < data.features.length; i++){
    //         var coords = data.features[i].geometry.coordinates;
    //         var latLng = new google.maps.LatLng(coords[1], coords[0]);
    //         var marker = new google.maps.Marker({
    //             position: latLng,
    //             map: map
    //         })
    //     }
    // });
=======
    $.ajax({
        url: "./js/station_GeoJSON.js",
        dataType: 'json',
        async: false,
        success: function(data){
            for (var i = 0; i < data.features.length; i++){
                var coord = data.features[i].geometry.coordinates;
                var latLng = new google.maps.LatLng(coord[1], coord[0]);
                addMarker(latLng);
            }
        }
    });

    for (var i = 0; i < markers.length; i++){
        google.maps.event.addListener(markers[i], 'click', function(event){
            var coord = event.latLng;

            for (var j = 0; j < markers.length; j++){
                if (markers[j].getPosition().lat() == coord.lat() && markers[j].getPosition().lng() == coord.lng()){
                    var infowindow = new google.maps.InfoWindow({
                        content: "contentString",
                        maxwidth: 300
                    });
>>>>>>> 13ac3d1de6eea9258450e451b0511263fa018411

                    google.maps.event.addListener(markers[j], 'click', function(){
                        infowindow.open(map, markers[j]);
                    });
                    break;
                }
            }
        });
    };
    
    // place a marker on the map where the user clicks
    google.maps.event.addListener(map, 'click', function(event){
        startlocation = event.latLng;

        var marker = new google.maps.Marker({position: startlocation, map: map});
        var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
        '<div id="bodyContent">'+
        '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
        'sandstone rock formation in the southern part of the '+
        'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
        'south west of the nearest large town, Alice Springs; 450&#160;km '+
        '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
        'features of the Uluru - Kata Tjuta National Park. Uluru is '+
        'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
        'Aboriginal people of the area. It has many springs, waterholes, '+
        'rock caves and ancient paintings. Uluru is listed as a World '+
        'Heritage Site.</p>'+
        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
        'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
        '(last visited June 22, 2009).</p>'+
        '</div>'+
        '</div>';
        var infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxwidth: 300
        });

        google.maps.event.addListener(marker, 'click', function(){
            infowindow.open(map, marker);
        });
    });
<<<<<<< HEAD

    var infowindow111 = new google.maps.InfoWindow({
        content: 'test',
        maxwidth: 300
    });

    google.maps.event.addListener(marker, 'click', function(){
        infowindow111.open(map, marker);
    });
=======
}

// Adds a marker to the map and push to the array.
function addMarker(location){
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon:'./img/station.png',
        animation: google.maps.Animation.DROP
      });

    markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
>>>>>>> 13ac3d1de6eea9258450e451b0511263fa018411
}