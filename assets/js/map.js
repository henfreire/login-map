function initMap() {
    // The location of Uluru
    var uluru = {lat: -19.932471, lng: -43.936047};
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 15, center: uluru});
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({position: uluru, map: map});
  }