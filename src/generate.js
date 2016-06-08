var fs = require('fs');
var _ = require('underscore-node');
// var style = require('../assets/style-mock_point+line.json');
// var style = require('../assets/style-test_point+line.json');
// var style = require('../assets/style-line.json');
// var style = require('../assets/style-point.json');
var style = require('../assets/style-point+line.json');

function generate(style) { // creategeojson data file
  var allLayers = style.layers;
  var pointLayers = [];
  var polyLayers = [];
  var lineLayers = [];
  // starting lng and lat for points
  var startLng_point = -122.6431;
  var startLat_point = 48.3543;
  var minusLat_point = 0.5;
  var newLat_point;
  // starting lng and lat for linestring
  var startLng_line1 = -118.3008;  // right side
  var startLng_line2 = -110.2148;  // right side
  var startLat_line = 49.8380;  // left side
  var minusLat_line = -0.5;
  var newLat_line;

  var geojson = {
    "type": "FeatureCollection",
      "features": []
    };

  allLayers.forEach(function(layer) { // let's access each layer
    if(layer.type !== undefined) {
      if(layer.type === 'symbol') { // only for symbols
        pointLayers.push({  // collect type and filter
        'id': layer.id,
        'type': layer.type,
        'source-layer': layer['source-layer']
        });
      }
      if(layer.type === 'line') { // only for lines
        lineLayers.push({  // collect type and filter
        'id': layer.id,
        'type': layer.type,
        'source-layer': layer['source-layer']
        });
      }
    } else {
      console.log(layer.id + ' needs to reference layer ' + layer.ref);
    }
  });

  // add points
  if(pointLayers !== undefined || pointLayers !== null) {
    pointLayers.forEach(function(layer, i) {
      // console.log(layer);
      // console.log('do we have point layers?');
      newLat_point = startLat_point - (minusLat_point * i);
      feature = {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [
            startLng_point,
            newLat_point
          ]
        },
        'properties': {
          'name': layer.id,
          'element': layer.id,
          'category': layer['source-layer']
        }
      };
      geojson.features.push(feature);
    });
    // return geojson;
  }
  // add lines
  if(lineLayers !== undefined || lineLayers !== null) {
    lineLayers.forEach(function(layer, i) {
      // console.log(layer);// + ' does this have a line-width ' + layer['line-width']);
      newLat_line = startLat_line + (minusLat_line * i);
      feature = {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [
            [
              startLng_line1,
              newLat_line
            ],
            [
              startLng_line2,
              newLat_line
            ]
          ]
        },
        'properties': {
          'element': layer.id,
          'category': layer['source-layer']
        }
      };
      geojson.features.push(feature);
    });
    return geojson;
  }
}

module.exports = generate;
