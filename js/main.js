$(document).ready( function() {
    resizeWindow();

    $(window).resize( function() {
        resizeWindow();
      });

    $("#closeNav").click( function() {
        $("#sidebar").width("0");
    });
});

$(document).on('click', '.list-group-item', function() {
    $(".list-group-item").removeClass("active");
    $(this).addClass("active");

    var index = $(this).index();
    // trigger the click event on station marker of this index
    google.maps.event.trigger(station_markers[index], 'click');

    // sort the nodes by distance with the accident spot
    sortNodesByDistance({lat: accident_marker.position.lat(), lng: accident_marker.position.lng()});
});

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

const marker_type = {
    STATION: 'station',
    ACCIDENT: 'accident'
}

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

function createSideBarList(k){
    var group = document.createElement('div');
    group.setAttribute('class', 'list-group');
    group.setAttribute('id', 'side-bar-list');

    for (var i = 0; i < k; i++){
        var anchor = document.createElement('a');
        if (i === 0){
            anchor.setAttribute("class", "list-group-item list-group-item-action flex-column align-items-start active");
        } else{
            anchor.setAttribute("class", "list-group-item list-group-item-action flex-column align-items-start");
        }
        anchor.setAttribute("href","#");

        var div = document.createElement('div');
        div.setAttribute("class", "d-flex w-100 justify-content-between");

        var h5 = document.createElement('h5');
        h5.setAttribute("class", "mb-1");
        h5.innerText = station_markers[i].id;

        var small = document.createElement('small');

        if (i === 0){
            small.innerText = 'the nearest';
        }

        div.appendChild(h5);
        div.append(small);

        var p = document.createElement('p');
        p.setAttribute("class","mb-1");
        p.innerText = station_markers[i].address;

        var zipSmall = document.createElement('small');
        zipSmall.innerText = station_markers[i].zip;

        anchor.appendChild(div);
        anchor.appendChild(p);
        anchor.appendChild(zipSmall);

        group.appendChild(anchor);
    }

    return group;
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
            mapTypeControl: false,
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

        if (info_window){
            info_window.close();
        }

        accident = event.latLng;
        accident_marker = new google.maps.Marker({
            position: accident,
            icon:'./img/jiaotongshigu.png',
            map: map});
        addMarkerClickListener(accident_marker, marker_type.ACCIDENT);

        var accident_coords = {lat: accident.lat(), lng: accident.lng()};
        // Show k-nearest stations on the map, hidden the others.
        setMapOnNearest(map, 4, accident_coords);

        map.setCenter({lat: accident.lat(), lng: accident.lng()});
        map.setZoom(accidentZoom);

        $('#side-bar-list').remove();
        var groupList = createSideBarList(4);
        $('#closeNav').after(groupList);
        $("#sidebar").css({"display": "block", "width": "350px"});

        google.maps.event.trigger(station_markers[0], 'click');
    });
}

// Adds a marker to the map and push to the array.
function addMarker(location, properties){
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon:'./img/station.png',
        animation: google.maps.Animation.DROP,
        id: properties.ID,
        address: properties.Address,
        zip: properties.ZipCode
      });

    station_markers.push(marker);
    addMarkerClickListener(marker, marker_type.STATION);
}

function concatStatConStr(marker){
    var trucks = getRandomInt(10);
    var contentString = '<div class="infowindow">'+
    '<div class="title full-width">'+ marker.id +
    '</div><div class="address"><div class="address-line full-width">' + marker.address + 
    '</div><div class="address-line full-width">' + marker.zip + 
    '</div></div><div class="truck"> Trucks: ' + trucks +
    '</div></div>';

    return contentString; 
}

function concatSpotConStr(marker){
    var contentString = '<div class="infowindow">'+
    '<div class="title full-width">'+ 'Accident Spot' +
    '</div><div class="address"><div class="latlng full-width">' + 
    marker.position.lat().toFixed(6) + ',' +  marker.position.lng().toFixed(6)
    '</div></div></div>';

    return contentString;
}

// Add a listener to a clicked marker
function addMarkerClickListener(marker, type){
    var conStr;
    if (type === marker_type.STATION){
        conStr = concatStatConStr(marker);
    } else {
        conStr = concatSpotConStr(marker);
    }
    
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
/**
 * 
 * @param {*} map Google map object
 * @param {*} k the number of stations shown
 * @param {*} coords accident spot coordinate
 */
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
/**
 * @param {*} coords the coordinate of accident spot
 */
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

function haversine_distance(point1, point2) {
    // R = 6371.0710 kms
    var R = 3958.8; // Radius of the Earth in miles
    var φ1 = point1.lat * (Math.PI / 180);    // convert degree to radian
    var φ2 = point2.lat * (Math.PI / 180);    // convert degree to radian
    var Δφ = φ2 - φ1;
    var Δλ = (point2.lng - point1.lng) * (Math.PI / 180);
    
    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    var d = R * c;
    return d;
}

/**
 * Heron Formular for area of triangle
 * @param {*} edge1 edge1
 * @param {*} edge2 edge2
 * @param {*} edge3 edge3
 */
function heron_formular(edge1,edge2,edge3){
    var p = (edge1 + edge2 + edge3) / 2;
    var area = Math.sqrt(p * (p - edge1) * (p - edge2) * (p - edge3));
    return area;
}

/**
 * Get distance from pointA to segment based on PointB and PointC
 * @param {*} pointA target point
 * @param {*} pointB segment vertex
 * @param {*} pointC segment vertex
 */
function get_distance(pointA, pointB, pointC){
    var edgeA = haversine_distance(pointB, pointC);
    var edgeB = haversine_distance(pointA, pointC);
    var edgeC = haversine_distance(pointA, pointB);

    if (edgeC * edgeC + edgeA * edgeA <= edgeB * edgeB) {
        return edgeC;
    }

    if (edgeB * edgeB + edgeA * edgeA <= edgeC * edgeC) {
        return edgeB;
    }

    return 2 * heron_formular(edgeA, edgeB, edgeC) / edgeA;
}