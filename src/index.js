var fs = require('fs');
var mapboxgl = require('mapbox-gl');
var generate = require('./generate.js');
var style = require('../assets/style-point.json');

// generate new data from style.json
var pointdata = generate(style);
// modify the style's sources object
style.sources = {
  'newdata': {
    'type': 'geojson',
    'data': pointdata
  }
};
// change all the layer refs to the new data source
style.layers.forEach(function(layer) {
  if(layer.source !== undefined) {
    delete layer['source-layer'];
    delete layer.filter;
    layer.source = 'newdata';
  }
});

console.log(style);

mapboxgl.accessToken = 'pk.eyJ1IjoibXNsZWUiLCJhIjoiclpiTWV5SSJ9.P_h8r37vD8jpIH1A6i1VRg';
var map = new mapboxgl.Map({
  container: 'map',
  style: style,
  hash: true,
  zoom: 3,
  center: [-102.30,33.43]
});