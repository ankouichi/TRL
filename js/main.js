$(document).ready(function() {
    resizeWindow();

    $(window).resize(function() {
        resizeWindow();
      });
})

var map;
var markers = [];
var info_window;

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

    $.ajax({
        url: "./js/station_GeoJSON.js",
        dataType: 'json',
        async: false,
        success: function(data){
            for (var i = 0; i < data.features.length; i++){
                var coord = data.features[i].geometry.coordinates;
                var latLng = new google.maps.LatLng(coord[1], coord[0]);
                addMarker(latLng, data.features[i].properties);
            }
        }
    });
    
    // place a marker on the map where the user clicks
    google.maps.event.addListener(map, 'click', function(event){
        accident = event.latLng;

        var marker = new google.maps.Marker({position: accident, map: map});
        addMarkerClickListener(marker, concatSpotConStr());
    });
}

// Adds a marker to the map and push to the array.
function addMarker(location, properties){
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon:'./img/station.png',
        animation: google.maps.Animation.DROP
      });

    markers.push(marker);
    addMarkerClickListener(marker, concatStatConStr(properties));
}

function concatStatConStr(properties){
    var trucks = getRandomInt(10);

    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h2 id="firstHeading" class="firstHeading">'+ properties.ID +
    '</h2><div id="bodyContent"><p>' + properties.Address + 
    ' ' + properties.ZipCode + 
    '<p><a href="#">Tracks: ' + trucks +
    '</a></p></div></div>';

    return contentString; 
}

function concatSpotConStr(){
    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h2 id="firstHeading" class="firstHeading">This is an accident spot</h2>'+
    '<div id="bodyContent">'+
    '<p>Test Address 1 Info</p>'+
    '<p>Test Address 2 Info</p>' +
    '<p><a href="#">Test Links</a></p>'
    '</div>'+
    '</div>';

    return contentString; 
}

// Add a listener to a clicked marker
function addMarkerClickListener(marker, conStr){
    var infowindow = new google.maps.InfoWindow({
        content: conStr,
        maxwidth: 300
    });

    google.maps.event.addListener(marker, 'click', function(){
        if(info_window){
            info_window.close();
        }

        infowindow.open(map, marker);
        info_window = infowindow;
    });
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
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }