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
var initialZoom = 11;
var accidentZoom = 14;
var nodes;
var node_markers = [];
var node_limit = 3;

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
    var goCenterUI = createControlDiv('goCenterUI', 'Click to recenter the map',
    'goCenterText','Center Map');
    controlDiv.appendChild(goCenterUI);

    var showAllUI = createControlDiv('showAllUI', 'Click to show the locations of all fire stations',
    'showAllText','Show All Stations');
    controlDiv.appendChild(showAllUI);

    // Setup the click event listeners: simply set the map to Chicago.
    goCenterUI.addEventListener('click', function() {
        map.setCenter(dallas);
        map.setZoom(initialZoom);
        setMapOnAll(map);
      });

    // Set up the click event listener for 'Show All':
    // Show all hidden fire stations on the map.
    showAllUI.addEventListener('click', function() {
        setMapOnAll(map);
    });

    /// TODO: Working on this part right now - March 11th, 2020
    var testCaseUI = createControlDiv('testCaseUI', 'Click to show the test case', 
    'testCaseText', 'Test Case');

    controlDiv.appendChild(testCaseUI);
    testCaseUI.addEventListener('click', function(){
        var testLocation = {lat: 32.8891282215679, lng: -96.78695373535156};
        map.setCenter(testLocation);
        map.setZoom(accidentZoom);

        if (accident_marker){
            accident_marker.setMap(null);
        }

        accident_marker = new google.maps.Marker({
            position: testLocation,
            icon:'./img/jiaotongshigu.png',
            map: map});

        // show 4-nearest fire stations
        setMapOnNearest(map, 4, testLocation);
        // sort the nodes by distance with the accident spot
        sortNodesByDistance(testLocation);
        google.maps.event.addListener(accident_marker, 'click', function(){
            if (node_limit - node_markers.length > 0){
                var node = {lat: parseFloat(nodes[node_markers.length].Y), lng: parseFloat(nodes[node_markers.length].X)};
                var node_marker = new google.maps.Marker({
                    position: node,
                    icon:'./img/add_location_2x.png',
                    map: map});
    
                node_markers.push(node_marker);
            } else{
                for (var i = 0; i < node_markers.length; i++) {
                    node_markers[i].setMap(null);
                }

                node_markers = [];
            }
        });
        
    });

  }

  // create Control Div with interior text and click function
  function createControlDiv(id, title, text_id, text_inner_html){
    // Set CSS for the control border
    var ui = document.createElement('div');
    ui.id = id;
    ui.title = title;

    // Set CSS for the control interior
    var text = document.createElement('div');
    text.id = text_id;
    text.innerHTML = text_inner_html;
    ui.appendChild(text);

    return ui;
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
            zoom: initialZoom,
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

    // Fetch fire stations 
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

    // Fetch nodes info
    $.getJSON("./js/nodes.json", function (data){
        nodes = data;
    });
    
    // place a marker on the map where the user clicks
    google.maps.event.addListener(map, 'click', function(event){
        // Bug fix: remove accident marker if exists.
        if (accident_marker){
            accident_marker.setMap(null);
            accident_marker = null;
        }

        accident = event.latLng;
        accident_marker = new google.maps.Marker({
            position: accident,
            icon:'./img/jiaotongshigu.png',
            map: map});
        addMarkerClickListener(accident_marker, concatSpotConStr());

        var accident_coords = {lat: accident.lat(), lng: accident.lng()};
        // Show k-nearest stations on the map, hidden the others.
        setMapOnNearest(map, 4, accident_coords);

        map.setCenter({lat: accident.lat(), lng: accident.lng()});
        map.setZoom(accidentZoom);
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
        a_lat_distance = a.position.lat() - coords.lat;
        a_lng_distance = a.position.lng() - coords.lng;
        a_l2_distance = Math.sqrt(a_lat_distance * a_lat_distance + a_lng_distance * a_lng_distance);

        b_lat_distance = b.position.lat() - coords.lat;
        b_lng_distance = b.position.lng() - coords.lng;
        b_l2_distance = Math.sqrt(b_lat_distance * b_lat_distance + b_lng_distance * b_lng_distance);

        return a_l2_distance - b_l2_distance
    });

    for (var i = 0; i < k; i++){
        station_markers[i].setMap(map);
    }
}

// TODO: Approach One: Radius - based

// Sort the whole node list by the distance between the accident spot and each node
function sortNodesByDistance(coords){
    nodes.sort(function(a,b){
        a_lat_distance = a.Y - coords.lat;
        a_lng_distance = a.X - coords.lng;
        a_l2_distance = Math.sqrt(a_lat_distance * a_lat_distance + a_lng_distance * a_lng_distance);

        b_lat_distance = b.Y - coords.lat;
        b_lng_distance = b.X - coords.lng;
        b_l2_distance = Math.sqrt(b_lat_distance * b_lat_distance + b_lng_distance * b_lng_distance);

        return a_l2_distance - b_l2_distance
    });
}

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