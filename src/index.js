var fs = require('fs');
var mapboxgl = require('mapbox-gl');
var data = require('./generate.js');
var style = require('../assets/test-point.json');
// var style = require('../assets/test-line.json');
// var style = require('../assets/test-poly.json');
// var style = require('../assets/satellite-streets-v9.json');

mapboxgl.accessToken = 'pk.eyJ1IjoibXNsZWUiLCJhIjoiclpiTWV5SSJ9.P_h8r37vD8jpIH1A6i1VRg';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mslee/ciod14n04007aaqm7iun2scux',
  hash: true,
  zoom: 4,
  center: [-104.68,32.69]
});

map.on('load', function () {
  map.addSource('data', {
    'type': 'geojson',
    'data': data
  });
  // reset source call
  style.layers.forEach(function(layer) {
    if(layer.source !== undefined) {
      layer.source = data;
      console.log(layer);
    }
  });
});


