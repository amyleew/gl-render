var mapboxgl = require('mapbox-gl');
var geojson = require('./generate.js');
var fs = require('fs');

mapboxgl.accessToken = 'pk.eyJ1IjoibXNsZWUiLCJhIjoiclpiTWV5SSJ9.P_h8r37vD8jpIH1A6i1VRg';
var bounds = [
  [-152.2265625, -2.460181181020993], //SW
  [33.75, 75.23066741281573] //NE
];
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mslee/ciod14n04007aaqm7iun2scux',
  hash: true,
  zoom: 13,
  center: [-122.6149,48.3434]
});

map.on('load', function () {
  var sourceObj = new mapboxgl.GeoJSONSource({
    data: geojson
  });
  map.addSource("markers", sourceObj);
  geojson.features.forEach(function(layer, i) { // add geojson features
    var fullLayer = layer.properties;
    map.addLayer({ // add values in each layer
      "id": fullLayer.name,
      "type": fullLayer.styleType,
      "source": "markers",
      "layout": {
        "text-field": fullLayer.layout['text-field'],
        "text-font": fullLayer.layout['text-font'],
      },
      "paint": {
        "text-halo-width": fullLayer.paint['text-halo-width'],
        "text-halo-color": fullLayer.paint['text-halo-color'],
        "text-color": fullLayer.paint['text-color']
      }
    });
    for(n = 0; n < geojson.features.length + 1; n++) {
      if(n === i) {
        map.setFilter(fullLayer.name, ['==', 'field', 'item'+i]);
      }
    }
  });
});