var fs = require('fs');
var mapboxgl = require('mapbox-gl');
var generate = require('./generate.js');

// styles to turn into data
var style = require('../assets/_gl-styles/streets-v9.json');

// generate new data from style.json
var generate_data = generate(style);
// modify the style's sources object
style.sources = {
  'newdata': {
    'type': 'geojson',
    'data': generate_data
  }
};
// change all the layer refs to the new data source
style.layers.forEach(function(layer) {
  if(layer.source !== undefined) {
    delete layer['source-layer'];
    delete layer.minzoom;
    delete layer.maxzoom;
    // delete layer.filter;
    layer.filter = [
      '==',
      'element',
      layer.id
    ];
    layer.source = 'newdata';
    if(layer.type == 'symbol') { // style names
      layer.layout['text-field'] = layer.id;
    }
  }
});

// console.log(generate_data.features);
console.log(style);

mapboxgl.accessToken = 'pk.eyJ1IjoibXNsZWUiLCJhIjoiclpiTWV5SSJ9.P_h8r37vD8jpIH1A6i1VRg';
var map = new mapboxgl.Map({
  container: 'map',
  style: style,
  hash: true,
  zoom: 4.73,
  center: [-110.9757,47.949]
});