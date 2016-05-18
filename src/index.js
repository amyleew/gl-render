var fs = require('fs');
var mapboxgl = require('mapbox-gl');

mapboxgl.accessToken = 'pk.eyJ1IjoibXNsZWUiLCJhIjoiclpiTWV5SSJ9.P_h8r37vD8jpIH1A6i1VRg';
var bounds = [
  [-152.2265625, -2.460181181020993], //SW
  [33.75, 75.23066741281573] //NE
];
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mslee/ciod14n04007aaqm7iun2scux',
  hash: true,
  zoom: 1.50,
  center: [-57.1,45.4],
  maxBounds: bounds
});

map.on('load', function () {
  var sourceObj = new mapboxgl.GeoJSONSource({
    data: "assets/renders.geojson"
  });

  map.addSource("markers", sourceObj);

  map.addLayer({
      "id": "markers",
      "type": "symbol",
      "source": "markers",
      "layout": {
          "text-field": "{field}",
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 0.6],
          "text-anchor": "top"
      }
  });

  map.scrollZoom.disable();
});