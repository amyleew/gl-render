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
var startLng = 0;
var startLat = 0;
var minusLat = 0.00236;
var newLat;

var geojson = {
  "type": "FeatureCollection",
    "features": []
  };

allLayers.forEach(function(layer) { // let's access each layer
  if(layer.filter !== undefined) {
    if(layer.type === 'line') { // only for lines
      pointLayers.push({  // collect type, source-layer, and filter
      'type': layer.type,
      'source-layer': layer['source-layer'],
      'filter': layer.filter
      });
    }
  }
});

function creategeojson(styleData) {
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

// generate new file
creategeojson();

// console.log(geojson);
module.exports = geojson;