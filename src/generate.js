var fs = require('fs');
var _ = require('underscore-node');
var style = require('../assets/satellite-streets-v9.json');

var allLayers = style.layers;
var choiceLayers = [];

var geojson = {
  "type": "FeatureCollection",
    "features": []
  };

// add tile once


// pull out specific layers for labels
allLayers.forEach(function(layer) { // let's access each layer
  // find the labels for places
  if(layer['source-layer'] === 'place_label' || layer['source-layer'] === 'country_label' || layer['source-layer'] === 'state_label') {
    choiceLayers.push(layer);
  }
});

// starting lng and lat
var startLng = -122.643127;
var startLat = 48.35436;
var minusLat = 0.00236;


// create the geojson data
function creategeojson(styleData) {
  choiceLayers.forEach(function(layer, i) { // let's access each layer
    var newLat = startLat - (minusLat * i); // new placement
    console.log(layer.id + ' position: ' + i);
    var feature = {
      'type': 'Feature',
      'properties': {
        'field': 'item' + i
      },
      'geometry': {
        'type': 'Point',
        'coordinates': [
          startLng,
          newLat
          ]
        }
      };
      geojson.features.push(feature);
  });
}

// generate new file
creategeojson();
fs.writeFile('generate.geojson', JSON.stringify(geojson, null, 2));

// loop in colors



// module.exports = names;
// module.exports = storage;