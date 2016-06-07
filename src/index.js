var fs = require('fs');
var mapboxgl = require('mapbox-gl');
var generate = require('./generate.js');
var style = require('../assets/test-point.json');
// var style = require('../assets/test-line.json');
// var style = require('../assets/test-poly.json');
// var style = require('../assets/satellite-streets-v9.json');

mapboxgl.accessToken = 'pk.eyJ1IjoibXNsZWUiLCJhIjoiclpiTWV5SSJ9.P_h8r37vD8jpIH1A6i1VRg';
var map = new mapboxgl.Map({
  container: 'map',
  style: style, // 'mapbox://styles/mslee/ciod14n04007aaqm7iun2scux',
  hash: true,
  zoom: 3,
  center: [-102.30,33.43]
});

map.on('load', function () {
  var data = generate(); // run function from required file to generate data
  map.addSource('newdata', {
    'type': 'geojson',
    'data': data
  });
  // reset source call
  style.layers.forEach(function(layer) {
    if(layer.source !== undefined) {
      layer.source = 'newdata';
      console.log(layer);
    }
  });
});