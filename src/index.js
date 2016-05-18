var fs = require('fs');
var mapboxgl = require('mapbox-gl');
var data = require('./data.js');

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
    data: "assets/renders.geojson"  // mslee.5jzf6k3f
  });
  map.addSource("markers", sourceObj);

  // loop thru each layer from data source
  data.forEach(function(layer, k) {
    // console.log(layer.layout);

    map.addLayer({ // add values in each layer
      "id": layer.id,
      "type": "symbol",
      "source": "markers",
      "layout": {
        "text-field": layer.id,
        "text-font": ["DIN Offc Pro Regular", "Arial Unicode MS Bold"],
        "text-offset": [0, 0.6],
        "text-anchor": "top-left"
        }
    })

    map.setFilter(layer.id, ['==', 'field', 'item' + k]);
  });

  map.scrollZoom.disable();
});


