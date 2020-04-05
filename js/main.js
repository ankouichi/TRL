$(document).ready( function() {
    resizeWindow();

    $(window).resize( function() {
        resizeWindow();
      });

    $("#closeNav").click( function() {
        $("#sidebar").width("0");
    });
});

$(document).on('click', '.dropdown-btn', function(){
    var display = $(this).next().css('display');
    if (display == "block"){
      $(this).next().css('display', 'none');
    } else {
      $(this).next().css('display', 'block');
    }

    $(this).next().addClass('active');
    $(".dropdown-btn").removeClass("active");
    $(this).addClass("active");

    var index = $('.dropdown-btn').index($(this));
    google.maps.event.trigger(station_markers[target_path_collection[index].station], 'click');
});

$(document).on('click', '.dropdown-item', function(){
    // change highlighted path
    $(".dropdown-item").removeClass("active");
    $(this).addClass("active");
    // change highlighted station
    $(".dropdown-btn").removeClass("active");
    $(this).parent().prev().addClass("active");

    deleteMarkers(polylines);

    var parent_index = $('.dropdown-btn').index($(this).parent().prev());
    var index = $(this).index();
    
    // trigger the click event on station marker of this index
    google.maps.event.trigger(station_markers[target_path_collection[parent_index].station], 'click');
    drawPath(parent_index, index, map);
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
var nodes_inside = [];
var circle;
var radius = 1610 // 5633 meters = 3.5 miles, 4828 meters = 3 miles, 3219 meters = 2 miles, 1610 meters = 1 mile
var paths;
var paths_potential = [];
var polylines = [];
var closest_paths = [];
var target_path_collection = [];

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

    // var showAllUI = createControlDiv('showAllUI', 'Click to show the locations of all fire stations',
    // 'showAllText','Show All Stations');
    // controlDiv.appendChild(showAllUI);

    // Setup the click event listeners: simply set the map to Chicago.
    goCenterUI.addEventListener('click', function() {
        map.setCenter(dallas);
        map.setZoom(initialZoom);
        setMapOnAll(map, station_markers);
      });

    // Set up the click event listener for 'Show All':
    // Show all hidden fire stations on the map.
    // showAllUI.addEventListener('click', function() {
    //     setMapOnAll(map, station_markers);
    // });
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

function createSideBarList(){
    var nodes = []; // station nodes for the closest paths
    target_path_collection = [];

    for (var i = 0; i < closest_paths.length; i++){
        // split the link id to three parts, the station node in second order
        var from = parseInt(closest_paths[i].linkId.split("n")[1]);
        closest_paths[i].from = from;
        nodes.push(from);
    }

    nodes = [...new Set(nodes)]; // remove duplicates
    for (var i = 0; i < nodes.length; i++){
        for (var j = 0; j < station_markers.length; j++){
            if (station_markers[j].node === nodes[i]){

                target_path_collection.push({
                    node: nodes[i],
                    station: j,
                    paths: []
                });

                break;
            }
        }
    }

    for (var i = 0; i < target_path_collection.length; i++){
        for (var j = 0; j < closest_paths.length; j++){
            if (closest_paths[j].from === target_path_collection[i].node){
                target_path_collection[i].paths.push(closest_paths[j]);
            }
        }
    }

    var group = document.createElement('div');
    group.setAttribute('class', 'list-group');
    group.setAttribute('id', 'side-bar-list');

    for (var i = 0; i < target_path_collection.length; i++){
        var anchor = document.createElement('a');
        anchor.setAttribute("class", "list-group-item list-group-item-action flex-column align-items-start dropdown-btn");
        if (i === 0){
            anchor.classList.add("active");
        }
        anchor.setAttribute("href","#");

        var div = document.createElement('div');
        div.setAttribute("class", "d-flex w-100 justify-content-between");

        var h5 = document.createElement('h5');
        h5.setAttribute("class", "mb-1");
        h5.innerText = station_markers[target_path_collection[i].station].id;

        var span = document.createElement('span');
        span.setAttribute("class", "badge badge-primary badge-pill");
        span.innerText = target_path_collection[i].paths.length;

        div.appendChild(h5);
        div.append(span);

        var p = document.createElement('p');
        p.setAttribute("class","mb-1");
        p.innerText = station_markers[target_path_collection[i].station].address + ", " +
         station_markers[target_path_collection[i].station].zip;

        // path list added 3/31/2020
        var dropdownDiv = document.createElement('div');
        dropdownDiv.setAttribute("class", "dropdown-container list-group");

        for (var j = 0; j < target_path_collection[i].paths.length; j++){
            var a = document.createElement('a');
            a.setAttribute("href","#");
            a.setAttribute("class", "dropdown-item");
            
            if (i == 0 && j == 0){
                a.classList.add("active");
            }

            var minutes = Math.ceil(target_path_collection[i].paths[j].travelTime / 60);
            var riskNum = target_path_collection[i].paths[j].travelRisk;
            var risk;
            if (riskNum > 0.05) {
                risk = 'High';
            } else if (riskNum > 0.01) {
                risk = 'Medium';
            } else {
                risk = 'Low';
            }

            // problem: the travel time is for the whole path not for the splitted.
            a.innerText = "Travel Time: " + minutes + " mins, Travel Risk: " + risk;

            if (j == 0 && i == 0){
                var noticeSpan = document.createElement('span');
                noticeSpan.setAttribute("class", "badge badge-primary badge-pill notice");
                noticeSpan.innerText = "fastest";
                a.appendChild(noticeSpan);
            }

            dropdownDiv.appendChild(a);
        }

        anchor.appendChild(div);
        anchor.appendChild(p);

        group.appendChild(anchor);
        group.appendChild(dropdownDiv);
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

    // Obtain fire stations 
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

    // Obtain nodes info
    $.getJSON("./js/nodes-new.json", function (data){
        nodes = data;
    });

    // Obtain paths info
    $.getJSON("./js/paths.json", function (data){
        paths = data;
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

        map.setCenter({lat: accident.lat(), lng: accident.lng()});
        map.setZoom(accidentZoom);

        if (circle){
            circle.setMap(null);
        }

        deleteMarkers(node_markers);
        deleteMarkers(polylines);
        paths_potential = [];
        nodes_inside = [];

        // Add a circle centered on the clicked point
        // circle = new google.maps.Circle({
        //     strokeColor: '#FF0000',
        //     strokeOpacity: 0.8,
        //     strokeWeight: 2,
        //     fillColor: '#FF0000',
        //     fillOpacity: 0.35,
        //     map: map,
        //     center: accident,
        //     radius: radius
        // });

        // check which nodes are inside the circle
        for (var i = 0; i < nodes.length; i++){
            if (haversine_distance(accident_coords, nodes[i]) * 1000 <= radius) {
                nodes_inside.push(nodes[i]);
            }
        }

        // obtain paths to every node within the circle
        for (var i = 0; i < nodes_inside.length; i++){
            var downStream = nodes_inside[i];   // node destination
            for (var j = 0; j < paths.length; j++){
                if (paths[j].downStream === downStream.id){
                    var points = paths[j].points;
                    var temp_distances = [];
                    for (var k = 0; k < points.length - 1; k++){
                        var temp_distance = get_distance(accident_coords, points[k], points[k + 1]);
                        temp_distances.push({distance: temp_distance, up: points[k], down: points[k + 1]});
                    }

                    var nearestSeg = getNearestSegment(temp_distances);
                    paths_potential.push({
                        linkId: paths[j].LinkID, 
                        distance: nearestSeg.distance,
                        number: i,
                        travelTime: paths[j].TravelTime,
                        travelRisk: paths[j].TravelRisk, 
                        points: paths[j].points, 
                        up: nearestSeg.up, 
                        down: nearestSeg.down});
                }
            }
        }

        // get closest paths
        getClosestPaths();

        // Show these closest path
        $('#side-bar-list').remove();
        var groupList = createSideBarList();
        $('#closeNav').after(groupList);
        $("#sidebar").css({"display": "block", "width": "350px"});
        google.maps.event.trigger(station_markers[target_path_collection[0].station], 'click');

        // Draw polyline path
        drawPath(0, 0, map);
    });
}

/**
 * Draw polyline route on the map
 * @param {*} col_idx collection index
 * @param {*} route_idx route index
 * @param {*} map map
 */
function drawPath(col_idx, route_idx, map){
    var route = target_path_collection[col_idx].paths[route_idx]
    var points = route.points;
    var upIdx = points.indexOf(route.up);
    var downIdx = points.indexOf(route.down);
    var correct_path = points.slice(0,downIdx + 1);

    var lineSymbol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
    };

    var targetPath = new google.maps.Polyline({
        path: correct_path,
        geodesic: true,
        strokeColor: '#1E90FF',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        icons: [{
            icon: lineSymbol,
            offset: '0%',
            repeat: '20%'
        }]
    });
      
    targetPath.setMap(map);
    polylines.push(targetPath);

    var seg_up_marker = new google.maps.Marker({
        position: route.up,
        icon:'./img/mediate-location.png',
        map: map
    })

    var seg_down_marker = new google.maps.Marker({
        position: route.down,
        icon:'./img/mediate-location.png',
        map: map
    })

    node_markers.push(seg_up_marker);
    node_markers.push(seg_down_marker);
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
        zip: properties.ZipCode,
        node: properties.ClosestNode
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

// // Sets the map on nearest station markers
// // Approach One: Number - based
// /**
//  * 
//  * @param {*} map Google map object
//  * @param {*} k the number of stations shown
//  * @param {*} coords accident spot coordinate
//  */
// function setMapOnNearest(map, k, coords, markers){
//     clearMarkers(markers);

//     markers.sort(function(a,b){
//         a_lat_distance = a.position.lat() - coords.lat;
//         a_lng_distance = a.position.lng() - coords.lng;
//         a_l2_distance = Math.sqrt(a_lat_distance * a_lat_distance + a_lng_distance * a_lng_distance);

//         b_lat_distance = b.position.lat() - coords.lat;
//         b_lng_distance = b.position.lng() - coords.lng;
//         b_l2_distance = Math.sqrt(b_lat_distance * b_lat_distance + b_lng_distance * b_lng_distance);

//         return a_l2_distance - b_l2_distance
//     });

//     for (var i = 0; i < k; i++){
//         markers[i].setMap(map);
//     }
// }

// Sort the whole node list by the distance between the accident spot and each node
/**
 * @param {*} coords the coordinate of accident spot
 */
function sortNodesByDistance(coords){
    nodes.sort(function(a,b){
        a_lat_distance = a.lat - coords.lat;
        a_lng_distance = a.lng - coords.lng;
        a_l2_distance = Math.sqrt(a_lat_distance * a_lat_distance + a_lng_distance * a_lng_distance);

        b_lat_distance = b.lat - coords.lat;
        b_lng_distance = b.lng - coords.lng;
        b_l2_distance = Math.sqrt(b_lat_distance * b_lat_distance + b_lng_distance * b_lng_distance);

        return a_l2_distance - b_l2_distance
    });
}

function getNearestSegment(segments){
    segments.sort(function(a,b){
        return a.distance - b.distance;
    });

    return segments[0];
}

// Get the paths containing the nearest segment
function getClosestPaths(){
    closest_paths = [];

    paths_potential.sort(function(a,b){
        return a.distance - b.distance;
    });

    for (var i = 0; i < paths_potential.length; i++){
        // check if the path contains the nearest segment
        if (paths_potential[i].distance !== paths_potential[0].distance){
            break;
        }

        closest_paths.push(paths_potential[i])
    }

    if (closest_paths.length > 1) {
        closest_paths.sort(function(a,b){
            return a.travelTime - b.travelTime;
        });
        
        // var indexOfDown = closest_paths[0].points.indexOf(closest_paths[0].down);
        // var intermediates = closest_paths[0].points.slice(0, indexOfDown + 1);
        var distincts = [];
        distincts.push(closest_paths[0]);

        for (var i = 1; i < closest_paths.length; i++){
            var idx = closest_paths[i].points.indexOf(closest_paths[i].down);
            var imds = closest_paths[i].points.slice(0, idx + 1);
            var matched = 1; // match flag

            for (var j = 0; j < distincts.length; j++){
                var tempIdx = distincts[j].points.indexOf(distincts[j].down);
                var tempImds = distincts[j].points.slice(0, tempIdx + 1);

                if (imds.length === tempImds.length){
                    var equal = 1;
                    // when the number of points are at the same
                    // match values of random index for 5 times
                    for (var k = 0; k < 10; k++) {
                        var id = getRandomInt(imds.length);
                        if (tempImds[id].lat !== imds[id].lat || tempImds[id].lng !== imds[id].lng){
                            equal = 0;
                            matched = 0;
                            break;
                        }
                    }

                    if (equal === 1) {
                        matched = 1;
                    }
                } else {
                    matched = 0;
                }

                if (matched === 1){
                    break;
                }
            }

            if (matched === 0){
                distincts.push(closest_paths[i]);
            }
        }
    
        closest_paths = distincts;
    }   
}

// Sets the map on all markers in the array.
function setMapOnAll(map, markers) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers(markers) {
    setMapOnAll(null, markers);
}

// Shows any markers currently in the array.
function showMarkers(markers) {
    setMapOnAll(map, markers);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers(markers) {
    clearMarkers(markers);
    markers = [];
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function haversine_distance(point1, point2) {
    var R = 6371.0710//kms
    //var R = 3958.8; // Radius of the Earth in miles
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