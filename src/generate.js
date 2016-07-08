var fs = require('fs');
var _ = require('underscore');
var SphericalMercator = require('sphericalmercator');

// By default, precomputes up to z30
var merc = new SphericalMercator({
    size: 256
});

// styles to turn into data
var style = require('../assets/_gl-styles/streets-v9.json');
var title = style.name;
// general style elements
var allFonts = [];  // points
var hasFonts;
var fontCount;
var allColors = [];  // polygons
var hasColors;
var colorCount;
var allFills = {}; // polygons
var fillCount;

var generate = function (style) { // creategeojson data file
  var allLayers = style.layers;
  var pointLayers = [];
  var polyLayers = [];
  var lineLayers = [];
  // title of the map style points
  var titleCoors = merc.forward([-131.8359, 60.2398]);
  var titleLat = -131.8359;
  var titleLng = 60.2398;
  console.log(titleCoors);

  // change value to add for subhead
  var changeSectionLat = 55.5078; // add values ?
  var changeSectionLng = -17.5;
  var changeFirstItemLng = -6;
  var changeItemLng = -5.5;
  var changeItemLat = 6;

  // starting lat and lng for points
  var minusLat_point = 0.5;
  var newLat_point;
  var newLng_point;
  var newFirstLng_point;
  var newSectionLng_point;

  // starting lng and lat for color polygon
  var changeFirstColorLng = -12;
  var changeColorLat = 6;
  var changeColorLng = 3;
  var changeColorSectionLng = -2;
  var colorLng2 = titleLng + changeSectionLng; // same for lng3
  var colorLat2 = titleLat + changeSectionLat; // same for lat1
  var colorLng1 = colorLng2 + changeSectionLng;  // same for lng4
  var colorLat3 = colorLat2 + changeColorLat; // same for lat4
  var newColorLng2;
  var newColorLat2;
  var newColorLng1;
  var newColorLat3;

  var geojson = {
    "type": "FeatureCollection",
      "features": []
    };

  allFills = { // pass the fill color and name
    'layers': [
    ]
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
      // only symbols
      if(layer.type === 'symbol') {
        if(layer.layout['text-font'] !== undefined) { // only show typeset symbols
          if(layer.layout['text-font'][0] !== undefined) { // show the first font
            allFonts.push(layer.layout['text-font'][0]);
          }
        }
      }
      if(layer.type === 'fill') { // only for polygons
        if(_.isObject(layer.paint['fill-color'])) { // these are objects
          var values = _.flatten(layer.paint['fill-color'].stops);
          for(n=0; n < values.length; n++) {
            if(_.isString(values[n])) {
              allColors.push(values[n]);
            }
          }
        }
        else {
          allColors.push(layer.paint['fill-color']);
        }
        if(_.isObject(layer.paint['fill-color'])) {
          var values2 = _.flatten(layer.paint['fill-color'].stops);
          for(p=0; p < values2.length; p++) {
            if(_.isString(values2[p])) {
              fillLayer = {
                'name': layer.id,
                'type': layer['source-layer'],
                'fill-color': values2[p]
              };
              allFills.layers.push(fillLayer);
            }
          }
        } else {
            fillLayer = {
              'name': layer.id,
              'type': layer['source-layer'],
              'fill-color': layer.paint['fill-color']
            };
            allFills.layers.push(fillLayer);
          }
      }

    }
  });
  // console.log(allFills);
  // console.log(allFills.layers);
  allFonts = _.uniq(allFonts); // doesn't send everything

  // add typeface collection
  if(allFonts !== undefined || allFonts !== null) {
    hasFonts = true;
    fontCount = allFonts.length;
    allFonts.forEach(function(font, i) {
      // section title and first item go here
      if(i === 0) {
        newSectionLng_point = titleLng + changeSectionLng;
        newFirstLng_point = newSectionLng_point + changeFirstItemLng;
        feature = {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [
              titleLat,
              newSectionLng_point
            ]
          },
          'properties': {
            'name': 'Typeface'
          }
        };
        geojson.features.push(feature);
        feature = {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [
              titleLat,
              newFirstLng_point
            ]
          },
          'properties': {
            'name': font,
            'text-field': font,
            'text-font': font
          }
        };
        geojson.features.push(feature);
      } else {
        newLng_point = newFirstLng_point + (changeItemLng*i);
        // STORE TYPEFACE STUFF AS FEATURE (NEXT COLORS ... right below it)
        feature = {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [
              titleLat,
              newLng_point
            ]
          },
          'properties': {
            'name': font,
            'text-field': font,
            'text-font': font
          }
        };
      }
      geojson.features.push(feature);
      });
  } else {
    hasFonts = false;
  }
  // add color collection
  if(allColors !== undefined || allColors !== null) {
    allColors = _.uniq(allColors);
    colorCount = allColors.length;
    allColors.forEach(function(color, j) {
      // section title and first item go here
      if(j === 0) {
        newSectionLng_point = titleLng + changeSectionLng;
        colorLng1 = newSectionLng_point + changeFirstColorLng;
        colorLng2 =  newFirstLng_point + changeColorLng;
        feature = {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [
              colorLat2,
              newSectionLng_point
            ]
          },
          'properties': {
            'name': 'Colors'
          }
        };
        geojson.features.push(feature);
        feature = {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [
              [
                [
                  colorLat2,
                  colorLng1
                ],
                [
                  colorLat2,
                  colorLng2
                ],
                [
                  colorLat3,
                  colorLng2
                ],
                [
                  colorLat3,
                  colorLng1
                ],
                [
                  colorLat2,
                  colorLng1
                ]
              ]
            ]
          },
          'properties': {
            'fill-color': color,
            'name': color
          }
        };
        geojson.features.push(feature);
      } else {
        newColorLat2 = colorLat2 + (changeColorLat*j);
        newColorLat3 = colorLat3 + (changeColorLat*j);
        feature = {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [
              [
                [
                  newColorLat2,
                  colorLng1
                ],
                [
                  newColorLat2,
                  colorLng2
                ],
                [
                  newColorLat3,
                  colorLng2
                ],
                [
                  newColorLat3,
                  colorLng1
                ],
                [
                  newColorLat2,
                  colorLng1
                ]
              ]
            ]
          },
          'properties': {
            'fill-color': color,
            'name': color
          }
        };
        geojson.features.push(feature);
      }
    });
  } else {
      hasColors = false;
    }
    if(allFills !== undefined || allFills !== null) {
      var sorted = {};
      Object.keys(allFills.layers).forEach(function(key) {
        var fill = allFills.layers[key];
        var type = fill.type;
        if (!sorted[type]) {
          sorted[type] = [fill];
        } else {
          sorted[type].push(fill);
        }
      });
      // save the new sections
      var eachType = [];
      allFills.layers.forEach(function(type, i) {
        eachType.push(type.type);
      });
      // for every object in sorted, place a section title layer (find each key)
      var newSection = false;
      var thisSection = -1;
      for (var section in sorted) { // loop thru each section
        newSection = true;  // this is a new section
        thisSection ++;
        // console.log('start new section number ' + thisSection + ', section ' + section);
        titleLng = titleLng + changeSectionLng;
        // console.log('start at lng ' + titleLng);
        Object.keys(sorted[section]).forEach(function(key, i) { // find the keys in each section
          if(i === 0) {
            newSectionLng_point = titleLng + changeSectionLng;
            colorLng1 = newSectionLng_point + changeSectionLng+3; // lowest point
            colorLng2 = newSectionLng_point + changeColorSectionLng;
            feature = {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [
                  colorLat2,
                  newSectionLng_point
                ]
              },
              'properties': {
                'name': sorted[section][key].type
              }
            };
            geojson.features.push(feature);
            feature = {
              'type': 'Feature',
              'geometry': {
                'type': 'Polygon',
                'coordinates': [
                  [
                    [
                      colorLat2,
                      colorLng1
                    ],
                    [
                      colorLat2,
                      colorLng2
                    ],
                    [
                      colorLat3,
                      colorLng2
                    ],
                    [
                      colorLat3,
                      colorLng1
                    ],
                    [
                      colorLat2,
                      colorLng1
                    ],
                  ]
                ]
              },
            'properties': {
              'name': sorted[section][key].name,
              'type': sorted[section][key].type,
              'fill-color': sorted[section][key]['fill-color']
            }
          };
          geojson.features.push(feature);
        } else { // same lat just down a row
          newSection = false; // also we are not making new section fills
          newColorLat2 = colorLat2 + (changeColorLat*i);
          newColorLat3 = colorLat3 + (changeColorLat*i);
          feature = {
            'type': 'Feature',
            'geometry': {
              'type': 'Polygon',
              'coordinates': [
                [
                  [
                    newColorLat2,
                    colorLng1
                  ],
                  [
                    newColorLat2,
                    colorLng2
                  ],
                  [
                    newColorLat3,
                    colorLng2
                  ],
                  [
                    newColorLat3,
                    colorLng1
                  ],
                  [
                    newColorLat2,
                    colorLng1
                  ],
                ]
              ]
            },
          'properties': {
            'name': sorted[section][key].name,
            'type': sorted[section][key].type,
            'fill-color': sorted[section][key]['fill-color']
          }
        };
        geojson.features.push(feature);
      }
    });
  }

  }
  return {
    geojson: geojson,
    allFonts: allFonts,
    name: title,
    allColors: allColors,
    allFills: allFills
  };
};

module.exports = generate;
