var fs = require('fs');
var mapboxgl = require('mapbox-gl');
var generate = require('./generate.js');
var style = require('../assets/style-point.json');
// run function from required file to generate data
var pointdata = generate(style);

// modify the style's sources object
style.sources['newdata'] = {
  'type': 'geojson',
  'data': pointdata
};

// change all the layer refs to the new data source
style.layers.forEach(function(layer) {
  if(layer.source !== undefined) {
    // console.log(layer['source-layer']);
    delete layer['source-layer'];
    layer.source = 'newdata';
  }
});

mapboxgl.accessToken = 'pk.eyJ1IjoibXNsZWUiLCJhIjoiclpiTWV5SSJ9.P_h8r37vD8jpIH1A6i1VRg';
var map = new mapboxgl.Map({
  container: 'map',
  style: style,
  hash: true,
  zoom: 3,
  center: [-102.30,33.43]
});