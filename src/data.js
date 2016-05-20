var fs = require('fs');
var _ = require('underscore-node');
var style = require('../assets/satellite-streets-v9.json');

// check this style
var storage = []; // storage array for layers
var names = []; // storing the names for the layers
var allLayers = style.layers;
allLayers.forEach(function(layer) { // remove the objects from array
  if(layer.ref === undefined) {
    var source = layer['source-layer'];
    if(source !== undefined) {
      if(source.indexOf('place_label') !== -1) {
        // console.log(layer.id);
        var filtering = _.flatten(layer.filter);
        if(filtering.indexOf('==') === 0) {
          if(filtering[2] === 'city') {
            storage.push(layer);
            names.push('City');
          }
          if(filtering[2] === 'town') {
            storage.push(layer);
            names.push('Town');
          }
          if(filtering[2] === 'village') {
            storage.push(layer);
            names.push('Village');
          }
          if(filtering[2] === 'hamlet') {
            storage.push(layer);
            names.push('Hamlet');
          }
          if(filtering[2] === 'suburb') {
            storage.push(layer);
            names.push('Suburb');
          }
          if(filtering[2] === 'neighbourhood') {
            storage.push(layer);
            names.push('Neighbourhood');
          }
          if(filtering[2] === 'island') {
            storage.push(layer);
            names.push('Island');
          }
          if(filtering[2] === 'islet') {
            storage.push(layer);
            names.push('Islet');
          }
          // if(filtering[2] === 'archipelago') {
          //   storage.push(layer);
          //   names.push('Archipelago');
          // }
          // if(filtering[2] === 'residential') {
          //   storage.push(layer);
          //   names.push('Residential');
          // }
          // if(filtering[2] === 'aboriginal_lands') {
          //   storage.push(layer);
          //   names.push('Aboriginal Lands');
          // }
        }
        // doesn't make it ......
        if(filtering.indexOf('==') > 0) {//} || filtering.indexOf('==') === 0) {
          var number = filtering.indexOf('==');
          if(filtering[number + 1] === 'type' && filtering[number + 2] === 'city') {
            storage.push(layer);
            names.push('City');
          }
          if(filtering[number + 1] === 'type' && filtering[number + 2] === 'town') {
            storage.push(layer);
            names.push('Town');
          }
          if(filtering[number + 1] === 'type' && filtering[number + 2] === 'village') {
            storage.push(layer);
            names.push('Village');
          }
          if(filtering[number + 1] === 'type' && filtering[number + 2] === 'hamlet') {
            storage.push(layer);
            names.push('Hamlet');
          }
          if(filtering[number + 1] === 'type' && filtering[number + 2] === 'suburb') {
            storage.push(layer);
            names.push('Suburb');
            // console.log(layer);
          }
          if(filtering[number + 1] === 'type' && filtering[number + 2] === 'neighbourhood') {
            storage.push(layer);
            names.push('Neighbourhood');
          }
          if(filtering[number + 1] === 'type' && filtering[number + 2] === 'island') {
            storage.push(layer);
            names.push('Island');
          }
          if(filtering[number + 1] === 'type' && filtering[number + 2] === 'islet') {
            storage.push(layer);
            names.push('Islet');
            // console.log(layer);
          }
          if(filtering[number + 1] === 'type' && filtering[number + 2] === 'archipelago') {
            storage.push(layer);
            names.push('Archipelago');
          }
          if(filtering[number + 1] === 'type' && filtering[number + 2] === 'residential') {
            storage.push(layer);
            names.push('Residential');
          }
          if(filtering[number + 1] === 'type' && filtering[number + 2] === 'aboriginal_lands') {
            storage.push(layer);
            names.push('Aboriginal Lands');
          }
        }
      }
    }
  } else {
    // console.log('data.js skipped this layer with ref: ' + layer.id);
  }
});


module.exports = names;
module.exports = storage;