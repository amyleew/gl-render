var fs = require('fs');
var _ = require('underscore-node');
var style = require('../assets/satellite-streets-v9.json');

// check this style
var storage = []; // storage array for layers
var names = []; // storing the names for the layers
var allLayers = style.layers;
allLayers.forEach(function(layer) { // remove the objects from array
  // console.log(layer);
  var source = layer['source-layer'];
  if(source !== undefined) {
    if(source.indexOf('place_label') !== -1) {
      var filtering = _.flatten(layer.filter);
      if(filtering.indexOf('==')) {
        var number = filtering.indexOf('==');
        if(filtering[number + 1] === 'type' && filtering[number + 2] === 'city') {
          storage.push(layer);
          names.push('City');
          // console.log(layer.layout['text-size'].stops.length);
        }
      }
    }
  }
});


module.exports = names;
module.exports = storage;