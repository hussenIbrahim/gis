var map;
var mode = "DRIVING";
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 36.182266,
      lng: 43.990748,
    },
    zoom: 13,

    fullscreenControl: false,
  });
  var directionsDisplay;
  var directionsService = new google.maps.DirectionsService();

  directionsDisplay = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: "red",
    },
  });

  directionsDisplay.setMap(map);
  var startMarker;
  var endMarker;
  var firtsInput = document.getElementById("firtsInput");
  var seconedInput = document.getElementById("seconedInput");
  var firstplaceAutocomplete = new google.maps.places.Autocomplete(firtsInput);
  firstplaceAutocomplete.addListener("place_changed", function () {
    var place = firstplaceAutocomplete.getPlace();
    // if (startMarker) {
    //     startMarker.setMap(null);
    // }
    addMarker(place.geometry.location, 1);
    map.setCenter(place.geometry.location);
  });
  firstplaceAutocomplete.bindTo("bounds", map);
  firstplaceAutocomplete.setFields([
    "address_components",
    "geometry",
    "icon",
    "name",
  ]);
  var secplaceAutocomplete = new google.maps.places.Autocomplete(seconedInput);
  secplaceAutocomplete.bindTo("bounds", map);
  secplaceAutocomplete.setFields([
    "address_components",
    "geometry",
    "icon",
    "name",
  ]);
  secplaceAutocomplete.addListener("place_changed", function () {
    var place = secplaceAutocomplete.getPlace();

    addMarker(place.geometry.location, );
    map.setCenter(place.geometry.location);
  });
  map.addListener("click", function (e) {
    if (!startMarker) {
      addMarker(e.latLng, 1);
    } else {
      addMarker(e.latLng, );
    }
  });
  var geocoder = new google.maps.Geocoder();
  function adddress(latLng, wichone) {
    geocoder.geocode(
      {
        latLng: latLng,
      },
      function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            if (wichone == 1) {
              document.getElementById("firtsInput").value =
                results[1].formatted_address;
            } else if (wichone == 2) {
              document.getElementById("seconedInput").value =
                results[1].formatted_address;
            }
          }
        }
      }
    );
  }

  function drawPolyLine() {
    if (!startMarker && !endMarker) {
    } else if (!endMarker) {
    } else if (!startMarker) {
    } else {
      var bounds = new google.maps.LatLngBounds();
      bounds.extend(startMarker.position);
      bounds.extend(endMarker.position);
      map.fitBounds(bounds);
      var request = {
        origin: startMarker.position,
        destination: endMarker.position,
        travelMode: mode,
      };
      directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          document.getElementById("dur").innerHTML =
            "duration : " +
            response["routes"][0]["legs"][0]["duration"]["text"];
          document.getElementById("dis").innerHTML =
            "distance : " +
            response["routes"][0]["legs"][0]["distance"]["text"];

          directionsDisplay.setDirections(response);
          directionsDisplay.setMap(map);
        } else {
          alert("Direction mode is not avilable");
        }
      });
    }
  }

  var stIcon = {
    url: "https://www.google.com/mapfiles/markerA.png", // url
    scaledSize: new google.maps.Size(28, 40), // size
  };
  var enIcon = {
    url: "https://www.google.com/mapfiles/markerB.png", // url
    scaledSize: new google.maps.Size(28, 40), // size
  };
  function addMarker(latLng, wichone) {
    if (wichone == 1) {
      if (startMarker) {
        startMarker.setMap(null);
      }
      startMarker = new google.maps.Marker({
        map: map,
        position: latLng,
        draggable: true,
        icon: stIcon,
      });
      adddress(startMarker.position, 1);

      drawPolyLine();
      google.maps.event.addListener(startMarker, "dragend", function (marker2) {
        adddress(marker2.latLng, 1);

        drawPolyLine();
      });
    } else {
      if (endMarker) {
        endMarker.setMap(null);
      }
      endMarker = new google.maps.Marker({
        map: map,
        position: latLng,
        draggable: true,
        icon: enIcon, // 'https://www.google.com/mapfiles/markerB.png'
      });
      adddress(endMarker.position, 2);
      google.maps.event.addListener(endMarker, "dragend", function (marker1) {
        adddress(marker1.latLng, 2);

        drawPolyLine();
      });
      drawPolyLine();
    }
  }
  document.getElementById("car").addEventListener("click", function () {
    mode = "DRIVING";
    drawPolyLine();
  });
  document.getElementById("walk").addEventListener("click", function () {
    mode = "WALKING";
    drawPolyLine();
  });
  document.getElementById("cyc").addEventListener("click", function () {
    mode = "BICYCLING";
    drawPolyLine();
  });
  // addMrker();
  // google.maps.event.addListener(window, 'load', initialize);
  document.getElementById("swap").addEventListener("click", function () {
    if (startMarker && endMarker) {
      var temp = document.getElementById("firtsInput").value;

      document.getElementById("firtsInput").value = document.getElementById(
        "seconedInput"
      ).value;
      document.getElementById("seconedInput").value = temp;

      temp = startMarker.position;
      var temp2 = endMarker.position;
      addMarker(temp, );

      addMarker(temp2, 1);
      drawPolyLine();
    }
  });
}
