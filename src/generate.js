var fs = require('fs');
var _ = require('underscore-node');
var style = require('../assets/test-point.json');
// var style = require('../assets/test-line.json');
// var style = require('../assets/test-poly.json');
// var style = require('../assets/satellite-streets-v9.json');

var allLayers = style.layers;
var pointLayers = [];
var polyLayers = [];
var lineLayers = [];
// starting lng and lat
var startLng = -122.6431;
var startLat = 48.3543;
var minusLat = 3;
var newLat;

var geojson = {
  "type": "FeatureCollection",
    "features": []
  };

allLayers.forEach(function(layer) { // let's access each layer
  if(layer.filter !== undefined) {
    if(layer.type === 'symbol') { // only for lines
      pointLayers.push({  // collect type, source-layer, and filter
      'id': layer.id,
      'type': layer.type,
      'source-layer': layer['source-layer'],
      'filter': layer.filter
      });
    }
  }
});

function generate(styleData) { // creategeojson data file
  pointLayers.forEach(function(layer, i) {
    newLat = startLat - (minusLat * i);
    feature = {
      'type': 'Feature',
      'geometry': {
        'type': 'Point',
        'coordinates': [
          startLng,
          newLat
        ]
      },
      'properties': {
        'name': layer.id,
        'source-layer': layer['source-layer'],
        'filter': layer.filter
      }
    };
    geojson.features.push(feature);
  });
}

// fs.writeFile('test-point.geojson', JSON.stringify(geojson, null, 2));

// // console.log(geojson);
// console.log(geojson.features);
// console.log(geojson.features[0].properties);
// console.log(geojson.features[0].geometry);
module.exports = generate;
