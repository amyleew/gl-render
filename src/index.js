var fs = require('fs');
var mapboxgl = require('mapbox-gl');
var Generate = require('./generate.js');
var _ = require('underscore');

// styles to turn into data
var style = require('../assets/_gl-styles/streets-v9.json');

// generate new data from style.json
var generate_data = Generate.generate(style);
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

console.log(generate_data.features);
// console.log(style);

mapboxgl.accessToken = 'pk.eyJ1IjoibXNsZWUiLCJhIjoiclpiTWV5SSJ9.P_h8r37vD8jpIH1A6i1VRg';
var map = new mapboxgl.Map({
  container: 'map',
  style: style,
  hash: true,
  zoom: 2,
  center: [-32.5,18]
});

// console.log(_.uniq(Generate.allFonts));
map.on('load', function() {
  location.hash = '2/18.0/-32.5';
  // add non-styled generate data
  map.addLayer({
    'id': 'styleTitle',
    'type': 'symbol',
    'source': 'newdata',
    'layout': {
      'text-field': Generate.name,
      'text-font': [Generate.allFonts[0], Generate.allFonts[1]],
      'text-size': 40
    }
  });

  // ADD TYPEFACE THEN COLOR LAYER


  // // style all typefaces used
  // var onlyFonts = _.uniq(Generate.allFonts);
  // onlyFonts.forEach(function (font, i) {
  //   // add non-styled generate data
  //   map.addLayer({
  //     'id': 'styleTitle',
  //     'type': 'symbol',
  //     'source': 'newdata',
  //     'layout': {
  //     }
  //   });
  // });
});








