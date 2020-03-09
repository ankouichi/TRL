$(document).ready(function() {
    resizeWindow();

    $(window).resize(function() {
        resizeWindow();
      });
})

var map;
var station_markers = [];
var accident_marker;
var info_window;
var dallas = {lat: 32.80, lng: -96.80};

// ajust the map size accoding to the window size
function resizeWindow(){
    width = $(window).width();
    height = $(window).height();

    $("#map").height(height).width(width);
}

/**
 * The CenterControl adds a control to the map that recenters the map on Dallas.
 * This constructor takes the control DIV as an argument.
 * @constructor
 */
function CenterControl(controlDiv, map) {

    // Set CSS for the go-center control border
    var goCenterUI = document.createElement('div');
    goCenterUI.id = 'goCenterUI';
    goCenterUI.title = 'Click to recenter the map';
    controlDiv.appendChild(goCenterUI);

    // Set CSS for the control interior
    var goCenterText = document.createElement('div');
    goCenterText.id = 'goCenterText';
    goCenterText.innerHTML = 'Center Map';
    goCenterUI.appendChild(goCenterText);

    // Set CSS for the show-all control border
    var showAllUI = document.createElement('div');
    showAllUI.id = 'showAllUI';
    showAllUI.title = 'Click to show the locations of all fire stations';
    controlDiv.appendChild(showAllUI);

    // Set CSS for the control interior
    var showAllText = document.createElement('div');
    showAllText.id = 'showAllText';
    showAllText.innerHTML = 'Show All Stations';
    showAllUI.appendChild(showAllText);

    // Setup the click event listeners: simply set the map to Chicago.
    goCenterUI.addEventListener('click', function() {
        map.setCenter(dallas);
      });

    // Set up the click event listener for 'Show All':
    // Show all hidden fire stations on the map.
    showAllUI.addEventListener('click', function() {
        setMapOnAll(map);
    });
  }

function initMap() {
    // The bounds of Dallas
    var Dallas_BOUNDS = {
        north: 33.20,
        south: 32.40,
        west: -97.70,
        east: -96.00
    };
    // The map, centered at Dallas
    map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 11,
            center: dallas,
            restriction:{
                latLngBounds: Dallas_BOUNDS,
                strictBounds: false
            },
            mapTypeId: 'roadmap' // roadmap,satellite,terrain,hybrid
        });

    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);

    centerControlDiv.index = 1;
    centerControlDiv.style['padding-top'] = '10px';
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

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
        // Bug fix: remove accident marker if exists.
        if (accident_marker){
            accident_marker.setMap(null);
            accident_marker = null;
        }

        accident = event.latLng;
        accident_marker = new google.maps.Marker({position: accident, map: map});
        addMarkerClickListener(accident_marker, concatSpotConStr());

        // Show k-nearest stations on the map, hidden the others.
        setMapOnNearest(map, 4, accident);
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

    station_markers.push(marker);
    addMarkerClickListener(marker, concatStatConStr(properties));
}

function concatStatConStr(properties){
    var trucks = getRandomInt(10);

    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h2 id="firstHeading" class="firstHeading">'+ properties.ID +
    '</h2><div id="bodyContent"><p>' + properties.Address + 
    ' , ' + properties.ZipCode + 
    '<p><a href="#">Trucks: ' + trucks +
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
        // Bug Fix: close info_window if exists.
        if(info_window){
            info_window.close();
        }

        infowindow.open(map, marker);
        info_window = infowindow;
    });
}

// Sets the map on nearest station markers
// Approach One: Number - based
function setMapOnNearest(map, k, coords){
    clearMarkers();

    station_markers.sort(function(a,b){
        a_lat_distance = a.position.lat() - coords.lat();
        a_lng_distance = a.position.lng() - coords.lng();
        a_l2_distance = Math.sqrt(a_lat_distance * a_lat_distance + a_lng_distance * a_lng_distance);

        b_lat_distance = b.position.lat() - coords.lat();
        b_lng_distance = b.position.lng() - coords.lng();
        b_l2_distance = Math.sqrt(b_lat_distance * b_lat_distance + b_lng_distance * b_lng_distance);

        return a_l2_distance - b_l2_distance
    });

    for (var i = 0; i < k; i++){
        station_markers[i].setMap(map);
    }
}

// TODO: Approach One: Radius - based

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < station_markers.length; i++) {
        station_markers[i].setMap(map);
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
    station_markers = [];
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }