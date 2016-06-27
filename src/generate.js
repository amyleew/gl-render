var fs = require('fs');
var _ = require('underscore');

// styles to turn into data
var style = require('../assets/_gl-styles/streets-v9.json');
var title = style.name;
// general style elements
var allFonts = [];
var hasFonts;
var fontCount;

function generate(style) { // creategeojson data file
  var allLayers = style.layers;
  var pointLayers = [];
  var polyLayers = [];
  var lineLayers = [];
  // title of the map style points
  var titleLat = -131.8359;
  var titleLng = 60.2398;

  // change value to add for subhead
  var changeSectionLat = -35.5078; // add values ?
  var changeSectionLng = -15.5;
  var changeItemLng = -2.925;

  // starting lat and lng for points
  var startLat_point = titleLat;
  var startLng_point = 49.8380;
  var minusLat_point = 0.5;
  var newLat_point;
  var newLng_point;


  var geojson = {
    "type": "FeatureCollection",
      "features": []
    };

  // plot the name / title of the style
  feature = {
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [
        titleLat,
        titleLng
      ]
    },
    'properties': {
      'name': title
    }
  };
  geojson.features.push(feature);

  allLayers.forEach(function(layer) { // let's access each layer to gather style info
    if(layer.type !== undefined) {
      if(layer.type === 'symbol') { // only show symbols
        if(layer.layout['text-font'] !== undefined) { // only show typeset symbols
          if(layer.layout['text-font'][0] !== undefined) { // show the first font
            allFonts.push(layer.layout['text-font'][0]);
          }
        }
    //     pointLayers.push({  // collect type and filter
    //       'id': layer.id,
    //       'type': layer.type,
    //       'source-layer': layer['source-layer']
    //     });
    //   }
    // } else {
    //   if(layer.ref) {
    //     var allLayersIndexbyRef = _.indexBy(allLayers, 'id'); // find a layer from all the layers from its id
    //     var refLayer = allLayersIndexbyRef[layer.ref];
    //     if(refLayer.type === 'symbol') { // only for symbols
    //       pointLayers.push({  // collect type and filter
    //         'id': layer.id,
    //         'type': refLayer.type,
    //         'source-layer': refLayer['source-layer']
    //       });
    //     }
      }
    }
  });

  allFonts = _.uniq(allFonts); // doesn't send everything
  // console.log(allFonts);

  // add typeface collection
  if(allFonts !== undefined || allFonts !== null) {
    hasFonts = true;
    fontCount = allFonts.length;
    // console.log(fontCount);
    allFonts.forEach(function(font, i) {
      console.log(font);
      // STORE TYPEFACE STUFF AS FEATURE (NEXT COLORS ... right below it)
      feature = {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [
            titleLat,
            titleLng
          ]
        },
        'properties': {
          'name': title
        }
      };
      geojson.features.push(feature);
        });
  } else {
    hasFonts = false;
  }

  // add points
  if(pointLayers !== undefined || pointLayers !== null) {
    pointLayers.forEach(function(layer, i) {
      // console.log('we have points');
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
  }
  return geojson;
}

module.exports = {
  generate: generate,
  allFonts: allFonts,
  name: title
};
