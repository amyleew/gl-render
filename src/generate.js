var fs = require('fs');
var _ = require('underscore-node');
var style = require('../assets/style-point.json');
// var style = require('../assets/style-line.json');
// var style = require('../assets/style-poly.json');
// var style = require('../assets/satellite-streets-v9.json');

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
  return geojson;
}

// to test data generated
// generate(geojson);
// fs.writeFile('data-point.geojson', JSON.stringify(geojson, null, 2));

module.exports = generate;
