var fs = require('fs');
var mapboxgl = require('mapbox-gl');
var _ = require('underscore');
// styles to turn into data
var style = require('../assets/_gl-styles/streets-v9.json');
// running function for data
var generatedData = require('./generate.js')(style);

// generate new data from style.json
var generate_data = generatedData.geojson; //Generate.generate(style);
// modify the style's sources object
style.sources = {
  'newdata': {
    'type': 'geojson',
    'data': generate_data
  }
};
// change all the layer refs to the new data source
style.layers.forEach(function(layer) {
  if(layer.source !== undefined) {
    delete layer['source-layer'];
    delete layer.minzoom;
    delete layer.maxzoom;
    // delete layer.filter;
    layer.filter = [
      '==',
      'element',
      layer.id
    ];
    layer.source = 'newdata';
    if(layer.type == 'symbol') { // style names
      layer.layout['text-field'] = layer.id;
    }
  }
});

var showSlider = document.getElementById('slider');
showSlider.className = 'center';

// console.log(generate_data.features);
// console.log(style);
// console.log(Generate);

mapboxgl.accessToken = 'pk.eyJ1IjoibXNsZWUiLCJhIjoiclpiTWV5SSJ9.P_h8r37vD8jpIH1A6i1VRg';
var map = new mapboxgl.Map({
  container: 'map',
  style: style,
  hash: true,
  zoom: 2,
  center: [25.4,-34.9]
});

map.on('load', function() {
  location.hash = '2/25.4,-34.9';
  // add non-styled generate data
  map.addLayer({
    'id': 'styleTitle',
    'type': 'symbol',
    'source': 'newdata',
    'layout': {
      'text-field': generatedData.name,
      'text-font': [generatedData.allFonts[0], generatedData.allFonts[1]],
      'text-size': 45,
      'text-anchor': 'left'
    },
    'filter': [
      '==',
      'name',
      generatedData.name
    ]
  });

  // console.log(generatedData);
  // console.log(generatedData.allFills);

  // style all typefaces used
  var onlyFonts = _.uniq(generatedData.allFonts);
  // add section label
  if (onlyFonts.length > 0) {
    map.addLayer({
      'id': 'section',
      'type': 'symbol',
      'source': 'newdata',
      'layout': {
        'text-field': 'Typeface',
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        'text-size': 12,
        'text-anchor': 'left'
      },
      'paint': {
        'text-opacity': 0.7
      },
    'filter': [
      '==',
      'name',
      'Typeface'
    ]
    });
  }
  onlyFonts.forEach(function (font, i) {
    // add non-styled generatedData data
    map.addLayer({
      'id': font,
      'type': 'symbol',
      'source': 'newdata',
      'layout': {
        'text-field': font,
        'text-font': [font, 'Arial Unicode MS Regular'],
        'text-size': 25,
        'text-anchor': 'left'
      },
      'filter': [
        '==',
        'name',
        font
      ]
    });
  });

  // style all colors used
  var onlyColors = _.uniq(generatedData.allColors);
  // add section label
  if (onlyColors.length > 0) {
    map.addLayer({
      'id': 'sectionColors',
      'type': 'symbol',
      'source': 'newdata',
      'layout': {
        'text-field': 'Colors',
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        'text-size': 12,
        'text-anchor': 'left'
      },
      'paint': {
        'text-opacity': 0.7
      },
    'filter': [
      '==',
      'name',
      'Colors'
    ]
    });
  }
  onlyColors.forEach(function (color, i) {
    // add non-styled generatedData data
    map.addLayer({
      'id': color,
      'type': 'fill',
      'source': 'newdata',
      'paint': {
        'fill-color': color
      },
      'filter': [
        '==',
        'name',
        color
      ]
    });
  });

  // style all fill colors used
  var onlyFills = generatedData.allFills.layers;
  var sorted = {}; // a new object to store our arrays of each value type
  // console.log(onlyFills);

  Object.keys(onlyFills).forEach(function(key) {
    var fill = onlyFills[key];
    var type = fill.type;
    if (!sorted[type]) { // if there is not key for this type...
      sorted[type] = [fill]; // make a key with the fill var as the first item in it's array
    } else { // we do already have this type
      sorted[type].push(fill); // add the var fill to the key type's array value
    }
  });

  // add the new section label
  var eachType = [];
  onlyFills.forEach(function(type, i) {
    eachType.push(type.type);
  });
  // for every object in sorted, place a section title layer (find each key)
  Object.keys(sorted).forEach(function(key, i) {
    map.addLayer({
      'id': key,
      'type': 'symbol',
      'source': 'newdata',
      'layout': {
        'text-field': key,
        'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
        'text-size': 12,
        'text-anchor': 'left',
        'text-transform': 'uppercase'
      },
      'paint': {
        'text-opacity': 0.7
      },
      'filter': [
        '==',
        'name',
        key
      ]
    });
    // now add each color from this section
    sorted[key].forEach(function (fill, i) {
      // console.log(fill);
      if(fill.type == key) {
        // console.log('for types ' + key);
        // add non-styled generatedData data
        map.addLayer({
          'id': fill.name,
          'type': 'fill',
          'source': 'newdata',
          'paint': {
            'fill-color': fill['fill-color']
          },
          'filter': [
            '==',
            'name',
            fill.name
          ]
        });
      }
    });
  });

  // loop in each object in the array for each section into a fill for the color

//   map.addLayer({
//   'id': 'sectionFills',
//   'type': 'symbol',
//   'source': 'newdata',
//   'layout': {
//     'text-field': 'Colors',
//     'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
//     'text-size': 12,
//     'text-anchor': 'left',
//     'text-transform': 'uppercase'
//   },
//   'paint': {
//     'text-opacity': 0.7
//   },
// 'filter': [
//   '==',
//   'name',
//   onlyFills.type
// ]
// });
// onlyFills.forEach(function (fill, i) {
// // console.log(fill);
// // add non-styled generatedData data
// map.addLayer({
//   'id': fill.name,
//   'type': 'fill',
//   'source': 'newdata',
//   'paint': {
//     'fill-color': fill['fill-color']
//   },
//   'filter': [
//     '==',
//     'name',
//     fill.name
//   ]
// });
// });

  // console.log(sorted);

  // add slider control for zoom
  map.scrollZoom.disable();
  var slider = document.getElementById('zoomSlide');
  var movement = document.getElementById('zoomSlide').value;
  slider.addEventListener('mouseup', moveZoom);

  // zoom to slider
  function moveZoom() {
    map.setZoom(document.getElementById('zoomSlide').value);
  }

});








