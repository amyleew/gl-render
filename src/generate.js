var fs = require('fs');
var _ = require('underscore-node');
var style = require('../assets/style-point.json');

function generate(style) { // creategeojson data file
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
    // if(layer.filter !== undefined) {
      if(layer.type === 'symbol') { // only for symbols
        pointLayers.push({  // collect type and filter
        'id': layer.id,
        'type': layer.type,
        'source-layer': layer['source-layer']
        });
      }
      if(layer.type === 'symbol') { // only for lines
        pointLayers.push({  // collect type and filter
        'id': layer.id,
        'type': layer.type,
        'source-layer': layer['source-layer']
        });
      }
    // }
  });

  if(pointLayers !== undefined || pointLayers !== null) {
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
          'category': layer['source-layer']
        }
      };
      geojson.features.push(feature);
    });
    return geojson;
  }
}

module.exports = generate;
