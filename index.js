// var test = require('tape');
var fs = require('fs');
// var _ = require('underscore-node');

// // map shit
// var requirejs = require('requirejs');
var mapboxgl = require('mapbox-gl');
mapboxgl.accessToken = 'pk.eyJ1IjoibXNsZWUiLCJhIjoiclpiTWV5SSJ9.P_h8r37vD8jpIH1A6i1VRg';
var bounds = [
  [-152.2265625, -2.460181181020993], //SW
  [33.75, 75.23066741281573] //NE
];
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mslee/ciod14n04007aaqm7iun2scux',
  hash: true,
  zoom: 1.50,
  center: [-57.1,45.4],
  maxBounds: bounds
});

// check this style
// var storage = {}; // storage array for layers
// var style = mapboxGL.styles['satellite-streets-v9'];
// var allLayers = style.layers;
// allLayers.forEach(function(layer) { // remove the objects from array
//   var source = layer['source-layer'];
//   if(source !== undefined) {
//     if(source.indexOf('place_label') !== -1) {
//       var filtering = _.flatten(layer.filter);
//       if(filtering.indexOf('==')) {
//         var number = filtering.indexOf('==');
//         if(filtering[number + 1] === 'type' && filtering[number + 2] === 'city') {
//           storage = layer;
//           console.log(storage);
//         }
//       }
//     }
//   }
// });

map.on('load', function () {
  var sourceObj = new mapboxgl.GeoJSONSource({
    data: "assets/renders.geojson"
  });

  map.addSource("markers", sourceObj);

  map.addLayer({
      "id": "markers",
      "type": "symbol",
      "source": "markers",
      "layout": {
          "text-field": "{field}",
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, 0.6],
          "text-anchor": "top"
      }
  });

  map.scrollZoom.disable();
});