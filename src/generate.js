var fs = require('fs');
var _ = require('underscore-node');
var style = require('../assets/satellite-streets-v9.json');

var allLayers = style.layers;
var choiceLayers = [];

var geojson = {
  "type": "FeatureCollection",
    "features": []
  };

// add title once
feature = {
  "type": "Feature",
  "properties": {
    "field": "title",
    'name': 'Place labels',
    'styleType': "symbol",
    'layout': {
      'text-field': 'Place labels',
      "text-font": [
        "DIN Offc Pro Medium",
        "Arial Unicode MS Regular"
      ],
    },
    'paint': {
      'text-color': '#333',
      "text-halo-width": 0,
      "text-halo-color": 'hsl(0, 100%, 100%)',
      'text-blur': 0
    }
  },
  "geometry": {
    "type": "Point",
    "coordinates": [
      -122.587060,
      48.354367
    ]
  }
};
geojson.features.push(feature);

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
var newLat;
// color start lng and lat
var startColorLng = -122.593260;
var startColorLat = 48.345411;
var minusColorLat = -0.02200; // move down
var minusColorLng = 0.025000; // move right
var newColorLng;
var newColorLat;
// create the geojson data
function creategeojson(styleData) {
  choiceLayers.forEach(function(layer, i) { // let's access each layer
    newLat = startLat - (minusLat * i); // new placement
    feature = {
      'type': 'Feature',
      'properties': {
        'field': 'item' + i,
        'name': layer.id,
        'styleType': layer.type,
        'layout': {
          'text-field': layer.id,
          'text-font': layer.layout['text-font'],
        },
        'paint': {
          'text-halo-width': layer.paint['text-halo-width'],
          'text-halo-color': layer.paint['text-halo-color'],
          'text-color': layer.paint['text-color'],
          'text-blur': layer.paint['text-blur']
        }
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
      // loop in colors
      // if(i < 3) {
      //   newColorLng = startColorLng + (minusColorLng * i);
      // }
      // if(i >= 3 && i < 6) {
      //   newColorLat = startColorLat + (minusColorLat * i);
      //   newColorLng = startColorLng + (minusColorLng * i);
      // }
      // if(i >= 6 && i < 9) {
      //   newColorLat = startColorLat + ((minusColorLat * i)*2);
      //   newColorLng = startColorLng + ((minusColorLng * i)*2);
      // }
      // if(i >= 9 && i < 12) {
      //   newColorLat = startColorLat + ((minusColorLat * i)*3);
      //   newColorLng = startColorLng + ((minusColorLng * i)*3);
      // }
      // if(i >= 12 && i < 15) {
      //   newColorLat = startColorLat + ((minusColorLat * i)*4);
      //   newColorLng = startColorLng + ((minusColorLng * i)*4);
      // }
      // if(i >= 15 && i < 18) {
      //   newColorLat = startColorLat + ((minusColorLat * i)*5);
      //   newColorLng = startColorLng + ((minusColorLng * i)*5);
      // }
      // if(i >= 18 && i < 21) {
      //   newColorLat = startColorLat + ((minusColorLat * i)*6);
      //   newColorLng = startColorLng + ((minusColorLng * i)*6);
      // }
      feature = {
        'type': 'Feature',
        'properties': {
          'field': 'color' + i,
          'name': 'color_' + layer.id,
          'styleType': "symbol",
          'layout': {
            'text-field': 'Title',
            "text-font": [
              "DIN Offc Pro Medium",
              "Arial Unicode MS Regular"
            ],
          },
          'paint': {
            'text-color': layer.paint['text-color'],
            "text-halo-width": 0,
            'text-halo-color': layer.paint['text-halo-color'],
            'text-blur': 0
          }
        },
        'geometry': {
          'type': 'Point',
          'coordinates': [
            newColorLng,
            newColorLat
          ]
        }
    };
    geojson.features.push(feature);
  });
}

// generate new file
creategeojson();


module.exports = geojson;
// module.exports = choiceLayers;
