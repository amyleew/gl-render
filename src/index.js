var fs = require('fs');
var mapboxgl = require('mapbox-gl');
var generate = require('./generate.js');
var style = require('../assets/style-point.json');
// var style = require('../assets/style-line.json');
// var style = require('../assets/style-poly.json');
// var style = require('../assets/satellite-streets-v9.json');

mapboxgl.accessToken = 'pk.eyJ1IjoibXNsZWUiLCJhIjoiclpiTWV5SSJ9.P_h8r37vD8jpIH1A6i1VRg';

// generate new data source based on style
var pointdata = generate(style);

// modify the style's sources object
style.sources['newdata'] = {
  'type': 'geojson',
  'data': pointdata
};

// change all the layer refs to the new data source
style.layers.forEach(function(layer) {
  if(layer.source !== undefined) {
    layer.source = 'newdata';
  }
});

// initalize the map
var map = new mapboxgl.Map({
  container: 'map',
  style: style,
  hash: true,
  zoom: 3,
  center: [-102.30,33.43]
});

// // map.on('load', function () {
// // });

