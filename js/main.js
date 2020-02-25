var stationMarkers = [];    // all station list

$(document).ready(function() {
    resizeWindow();

    $(window).resize(function() {
        resizeWindow();
      });
})

function resizeWindow(){
    width = $(window).width();
    height = $(window).height();

    $("#map").height(height).width(width);
}

function initMap() {
    // The location of Dallas
    var dallas = {lat: 32.76, lng: -97.04};
    // The map, centered at Dallas
    var map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 11,
            center: dallas,
            mapTypeId: 'roadmap' // roadmap,satellite,terrain,hybrid
        });

    $.getJSON("./js/demo_GeoJSON.js", function(data){
        for (var i = 0; i < data.features.length; i++){
            var coords = data.features[i].geometry.coordinates;
            var latLng = new google.maps.LatLng(coords[1], coords[0]);
            var marker = new google.maps.Marker({
                position: latLng,
                map: map
            })

            stationMarkers.push(marker);
        }
    });

    for (var i = 0; i < stationMarkers.length; i++){
        alert(i);
        // var contentString = 'hello';
        // var infowindow = new google.maps.InfoWindow({
        //     content: contentString,
        //     maxwidth: 300
        // });

        // google.maps.event.addListener(stationMarkers[i], 'click', function(){
        //     infowindow.open(map, stationMarkers[i]);
        // });
    }

    // place a marker on the map where the user clicks
    google.maps.event.addListener(map, 'click', function(event){
        startlocation = event.latLng;

        var marker = new google.maps.Marker({position: startlocation, map: map});
        var contentString = '<div style="width:300px;">' + 'Lat: ' + startlocation.lat() + ', Lng: ' + startlocation.lng() + '</div>';
        var infowindow = new google.maps.InfoWindow({
            content: contentString,
            maxwidth: 300
        });

        google.maps.event.addListener(marker, 'click', function(){
            infowindow.open(map, marker);
        });
    });
}