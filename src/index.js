var mapboxgl = require('mapbox-gl');
var data = require('./data.js');
var fs = require('fs');

// console.log(data.length);
var added = false; // make sure data is all layered before filtering

mapboxgl.accessToken = 'pk.eyJ1IjoibXNsZWUiLCJhIjoiclpiTWV5SSJ9.P_h8r37vD8jpIH1A6i1VRg';
var bounds = [
  [-152.2265625, -2.460181181020993], //SW
  [33.75, 75.23066741281573] //NE
];
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mslee/ciod14n04007aaqm7iun2scux',
  hash: true,
  zoom: 13,
  center: [-122.6149,48.3434]
  // zoom, lng, lat
  // maxBounds: bounds
});

map.on('load', function () {
  var sourceObj = new mapboxgl.GeoJSONSource({
    // data: "assets/z14_48-3432_122-6154.geojson"  // mslee.5jzf6k3f
    data: "../generate.geojson"  // mslee.5jzf6k3f
  });
  map.addSource("markers", sourceObj);

  // loop thru each layer from data source
  data.forEach(function(layer, k) {
    added = false;
    // ADD ALLL THE DATA TO VALUES
    var textSize = layer.layout['text-size'].stops;
    var textSizeBase = layer.layout['text-size'].base;
    var textSizeValues = {};
    var textSizeValuesArray = [];
    if(textSize.length > 1) { // save all the diff sizes set
      for(i=0; i < textSize.length; i++) {
        textSizeValues.id = layer.id;
        textSizeValues.zoom = textSize[i][0];
        textSizeValues.font = textSize[i][1];
        textSizeValuesArray.push({
          "id": textSizeValues.id,
          "zoom": parseFloat(textSizeValues.zoom),
          "font": parseFloat(textSizeValues.font)
        });
      }
    } else {
      // console.log(textSize.length);
    }
    // text-font values
    var textFont = layer.layout['text-font'].stops;
    var textFontBase = layer.layout['text-font'].base;
    var textFontValues = {};
    var textFontValuesArray = [];
    var textFont1; // for the strings
    var textFont2;
    if(textFont !== undefined) {
      // console.log(layer.id + ' ' + textFont.length);
      if(textFont.length > 1) { // save all the diff Fonts set
        for(i=0; i < textFont.length; i++) {
          textFontValues.id = layer.id;
          textFontValues.zoom = textFont[i][0];
          textFontValues.font = textFont[i][1];
          textFontValuesArray.push({
            "id": textFontValues.id,
            "zoom": textFontValues.zoom,
            "font": textFontValues.font
          });
        }
      }
    } else { // these items only have one set of fontstacks
      // console.log(layer.id + ' only have one fontstack');
      textFont = layer.layout['text-font'];
      textFont1 = textFont[0].toString();
      textFont2 = textFont[1].toString();
      textFontValuesArray = undefined;
    }
    var textLetterSpacing  = layer.layout['text-letter-spacing'];
    var textLetterSpacingBase;
    var textLetterSpacingValues = {};
    var textLetterSpacingValuesArray = [];
    if(textLetterSpacing !== undefined) {
      if(textLetterSpacing.length !== undefined) {
        textLetterSpacing = layer.layout['text-letter-spacing'].stops;
        textLetterSpacingBase = layer.layout['text-letter-spacing'].base;
        for(i=0; i < textLetterSpacing.length; i++) {
          textLetterSpacingValues.id = layer.id;
          textLetterSpacingValues.zoom = textLetterSpacing[i][0];
          textLetterSpacingValues.font = textLetterSpacing[i][1];
          textLetterSpacingValuesArray.push({
            "id": textLetterSpacingValues.id,
            "zoom": textLetterSpacingValues.zoom,
            "font": textLetterSpacingValues.font
          });
        }
      } else {// these items only have one text-letterspacing
      // console.log(layer.id + ' only has one text-letter-spacing');
      textLetterSpacing = parseFloat(layer.layout['text-offset']);
      textLetterSpacing1 = textLetterSpacing[0];
      textLetterSpacing2 = textLetterSpacing[1];
      textLetterSpacingValuesArray = undefined;
        }
    }
    // gather text-color values
    var textColor = layer.paint['text-color'];
    console.log(textColor);
    // gather text-halo-color values
    var textHaloColor = layer.paint['text-halo-color'];
    var textHaloColorBase;
    var textHaloColorValues = {};
    var textHaloColorValuesArray = [];
    if(textHaloColor !== undefined) {
      textHaloColor = layer.paint['text-halo-color'].stops;
      textHaloColorBase = layer.paint['text-halo-color'].base;
      for(i=0; i < textHaloColor.length; i++) {
        textHaloColorValues.id = layer.id;
        textHaloColorValues.zoom = textHaloColor[i][0];
        textHaloColorValues.font = textHaloColor[i][1];
        textHaloColorValuesArray.push({
          "id": textHaloColorValues.id,
          "zoom": parseFloat(textHaloColorValues.zoom),
          "font": textHaloColorValues.font
        });
      }
    }
    // gather text-halo-width values
    var textHaloWidth = layer.paint['text-halo-width'];
    // gather text-halo-blur values
    var textHaloBlur = layer.paint['text-halo-blur'];

    // START ADDING LAYERS
    if(textSizeValuesArray !== undefined && textFontValuesArray !== undefined && textLetterSpacingValuesArray !== undefined && textHaloColorValuesArray !== undefined) {
    added = true;
      map.addLayer({ // add values in each layer
        "id": layer.id,
        "type": "symbol",
        "source": "markers",
        "layout": {
          "text-field": layer.id,
          "text-font":{
            "base": textFontBase,
            "stops": [
              [
                textFontValuesArray[0].zoom,
                [
                  textFontValuesArray[0].font[0],
                  textFontValuesArray[0].font[1]
                ]
              ],
              [
                textFontValuesArray[1].zoom,
                [
                  textFontValuesArray[1].font[0],
                  textFontValuesArray[1].font[1]
                ]
              ]
            ]
          },
          "text-anchor": "top-left", // keep as is for placement on styleguide
          "text-size": {
            "base": textSizeBase,
            "stops": [
              [
                textSizeValuesArray[0].zoom,
                textSizeValuesArray[0].font
              ],
              [
                textSizeValuesArray[1].zoom,
                textSizeValuesArray[1].font
              ]
            ]
          },
        },
        "paint": {
          "text-halo-width": textHaloWidth,
          "text-halo-color": {
            "base": textHaloColorBase,
            "stops": [
              [
                textHaloColorValuesArray[0].zoom,
                textHaloColorValuesArray[0].font
              ],
              [
                textHaloColorValuesArray[1].zoom,
                textHaloColorValuesArray[1].font
              ]
            ]
          },
          "text-color": textColor,
          "text-halo-blur": textHaloBlur
        }
      });
    }
    if(textSizeValuesArray !== undefined && textFontValuesArray === undefined && textLetterSpacingValuesArray === undefined && textHaloColorValuesArray !== undefined) {
      added = true;
      map.addLayer({ // add values in each layer
        "id": layer.id,
        "type": "symbol",
        "source": "markers",
        "layout": {
          "text-field": layer.id,
          "text-font": [
            textFont1,
            textFont2
          ],
          "text-anchor": "top-left", // keep as is for placement on styleguide
          "text-size": {
            "base": textSizeBase,
            "stops": [
              [
                textSizeValuesArray[0].zoom,
                textSizeValuesArray[0].font
              ],
              [
                textSizeValuesArray[1].zoom,
                textSizeValuesArray[1].font
              ]
            ]
          },
        },
        "paint": {
          "text-halo-width": textHaloWidth,
          "text-halo-color": {
            "base": textHaloColorBase,
            "stops": [
              [
                textHaloColorValuesArray[0].zoom,
                textHaloColorValuesArray[0].font
              ],
              [
                textHaloColorValuesArray[1].zoom,
                textHaloColorValuesArray[1].font
              ]
            ]
          },
          "text-color": textColor,
          "text-halo-blur": textHaloBlur
        }
      });
    }

    if(layer.id === 'place-city-sm') {
      added = true;
      map.addLayer({ // add values in each layer
        "id": layer.id,
        "type": "symbol",
        "source": "markers",
        "layout": {
          "text-field": layer.id,
          "text-font":{
            "base": textFontBase,
            "stops": [
              [
                textFontValuesArray[0].zoom,
                [
                  textFontValuesArray[0].font[0],
                  textFontValuesArray[0].font[1]
                ]
              ],
              [
                textFontValuesArray[1].zoom,
                [
                  textFontValuesArray[1].font[0],
                  textFontValuesArray[1].font[1]
                ]
              ]
            ]
          },
          "text-anchor": "top-left", // keep as is for placement on styleguide
          "text-size": {
            "base": textSizeBase,
            "stops": [
              [
                textSizeValuesArray[0].zoom,
                textSizeValuesArray[0].font
              ],
              [
                textSizeValuesArray[1].zoom,
                textSizeValuesArray[1].font
              ]
            ]
          },
        },
        "paint": {
          "text-halo-width": textHaloWidth,
          "text-halo-color": {
            "base": textHaloColorBase,
            "stops": [
              [
                textHaloColorValuesArray[0].zoom,
                textHaloColorValuesArray[0].font
              ],
              [
                textHaloColorValuesArray[1].zoom,
                textHaloColorValuesArray[1].font
              ]
            ]
          },
          "text-color": textColor,
          "text-halo-blur": textHaloBlur
        }
      });
    }

       // add all colors
    if(layer.paint["text-color"] !== undefined) {
      // console.log("first is: circle" + k)
      map.addLayer({
        "id": "circle-" + layer.id,
        "type": "circle",
        "source": "markers",
        "maxzoom": 22,
        "paint": {
          "circle-color": textColor,
          "circle-radius": 6
        }
      });
    }

    // console.log(layer + ' and number: ' + k);

    for(n = 0; n < data.length + 1; n++) { // assign to map data
      if(added) {
        map.setFilter(layer.id, ['==', 'field', 'item' + k]);
      }
    }

    for(m = 0; m < data.length + 1; m++) { // assign colors to the map rendering
      if(added) {
        // if(layer.paint["text-color"] !== undefined) {
          console.log("circle-" + layer.id);
          map.setFilter("circle-" + layer.id, ['==', 'field', 'color' + k]);
        // }
        }
      }
  });
  // map.scrollZoom.disable();
});


