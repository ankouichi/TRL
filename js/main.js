$(document).ready(function() {
    resizeWindow();

    $(window).resize(function() {
        resizeWindow();
      });
});

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
    // The marker, positioned at Dallas
    // var marker = new google.maps.Marker({position: dallas, map: map});

    // place a marker on the map where the user clicks
    google.maps.event.addListener(map, 'click', function(event){
        startlocation = event.latLng;

        //alert(startlocation.lat());
        //alert(startlocation.lng());

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