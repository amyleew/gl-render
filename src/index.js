var fs = require('fs');
var mapboxgl = require('mapbox-gl');
var data = require('./data.js');

// console.log(data);

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
    data: "assets/z14_48-3432_122-6154.geojson"  // mslee.5jzf6k3f
  });
  map.addSource("markers", sourceObj);

  // loop thru each layer from data source
  data.forEach(function(layer, k) {
    // text-size values -- function to pass in the 'text-size' and remove hypen?
    var textSize = layer.layout['text-size'].stops;
    var textSizeBase = layer.layout['text-size'].base;
    var textSizeValues = {};
    var textSizeValuesArray = [];
    if(textSize.length > 1) { // save all the diff sizes set
      for(i=0; i < textSize.length; i++) {
        textSizeValues.id = layer.id;
        textSizeValues.layer = textSize[i][0];
        textSizeValues.font = textSize[i][1];
        textSizeValuesArray.push({
          "id": textSizeValues.id,
          "layer": textSizeValues.layer,
          "font": textSizeValues.font
        });
      }
    }
    // text-font values
    var textFont = layer.layout['text-font'].stops;
    var textFontBase = layer.layout['text-font'].base;
    var textFontValues = {};
    var textFontValuesArray = [];
    if(textFont.length > 1) { // save all the diff Fonts set
      for(i=0; i < textFont.length; i++) {
        textFontValues.id = layer.id;
        textFontValues.layer = textFont[i][0];
        textFontValues.font = textFont[i][1];
        textFontValuesArray.push({
          "id": textFontValues.id,
          "layer": textFontValues.layer,
          "font": textFontValues.font
        });
      }
    }
    // text-offset values
    var textOffset = layer.layout['text-offset'].stops;
    var textOffsetBase = layer.layout['text-offset'].base;
    var textOffsetValues = {};
    var textOffsetValuesArray = [];
    if(textOffset.length > 1) { // save all the diff Offsets set
      for(i=0; i < textOffset.length; i++) {
        textOffsetValues.id = layer.id;
        textOffsetValues.layer = textOffset[i][0];
        textOffsetValues.font = textOffset[i][1];
        textOffsetValuesArray.push({
          "id": textOffsetValues.id,
          "layer": textOffsetValues.layer,
          "font": textOffsetValues.font
        });
      }
    }
    // text-letter-spacing values
    var textLetterSpacing  = layer.layout['text-letter-spacing'];
    var textLetterSpacingBase;
    var textLetterSpacingValues = {};
    var textLetterSpacingValuesArray = [];
    if(textLetterSpacing !== undefined) {
      textLetterSpacing = layer.layout['text-letter-spacing'].stops;
      textLetterSpacingBase = layer.layout['text-letter-spacing'].base;
      for(i=0; i < textLetterSpacing.length; i++) {
        textLetterSpacingValues.id = layer.id;
        textLetterSpacingValues.layer = textLetterSpacing[i][0];
        textLetterSpacingValues.font = textLetterSpacing[i][1];
        textLetterSpacingValuesArray.push({
          "id": textLetterSpacingValues.id,
          "layer": textLetterSpacingValues.layer,
          "font": textLetterSpacingValues.font
        });
      }
    }
    // gather text-color values
    var textColor = layer.paint['text-color'];
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
        textHaloColorValues.layer = textHaloColor[i][0];
        textHaloColorValues.font = textHaloColor[i][1];
        textHaloColorValuesArray.push({
          "id": textHaloColorValues.id,
          "layer": textHaloColorValues.layer,
          "font": textHaloColorValues.font
        });
      }
    }
    // gather text-halo-width values
    var textHaloWidth = layer.paint['text-halo-width'];
    // gather text-halo-blur values
    var textHaloBlur = layer.paint['text-halo-blur'];

    if(textLetterSpacing !== undefined && textHaloColor !== undefined) {

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
                textFontValuesArray[0].layer,
                [
                  textFontValuesArray[0].font[0],
                  textFontValuesArray[0].font[1]
                ]
              ],
              [
                textFontValuesArray[1].layer,
                [
                  textFontValuesArray[1].font[0],
                  textFontValuesArray[1].font[1]
                ]
              ]
            ]
          },
          "text-offset": {
            "base": textOffsetBase,
            "stops": [
              [
                textOffsetValuesArray[0].layer,
                [
                  textOffsetValuesArray[0].font[0],
                  textOffsetValuesArray[0].font[1]
                ]
              ],
              [
                textOffsetValuesArray[1].layer,
                [
                  textOffsetValuesArray[1].font[0],
                  textOffsetValuesArray[1].font[1]
                ]
              ]
            ]
          },
          "text-anchor": "top-left", // keep as is for placement on styleguide
          "text-size": {
            "base": textSizeBase,
            "stops": [
              [
                textSizeValuesArray[0].layer,
                textSizeValuesArray[0].font
              ],
              [
                textSizeValuesArray[1].layer,
                textSizeValuesArray[1].font
              ]
            ]
          },
          "text-letter-spacing": {
            "base": textLetterSpacingBase,
            "stops": [
              [
                textLetterSpacingValuesArray[0].layer,
                textLetterSpacingValuesArray[0].font
              ],
              [
                textLetterSpacingValuesArray[1].layer,
                textLetterSpacingValuesArray[1].font
              ]
            ]
          }
        },
        "paint": {
          "text-halo-width": textHaloWidth,
          "text-halo-color": {
            "base": textHaloColorBase,
            "stops": [
              [
                textHaloColorValuesArray[0].layer,
                textHaloColorValuesArray[0].font
              ],
              [
                textHaloColorValuesArray[1].layer,
                textHaloColorValuesArray[1].font
              ]
            ]
          },
          "text-color": textColor,
          "text-halo-blur": textHaloBlur
        }
      })
    } else { // if there is no text-letter-spacing value set
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
                textFontValuesArray[0].layer,
                [
                  textFontValuesArray[0].font[0],
                  textFontValuesArray[0].font[1]
                ]
              ],
              [
                textFontValuesArray[1].layer,
                [
                  textFontValuesArray[1].font[0],
                  textFontValuesArray[1].font[1]
                ]
              ]
            ]
          },
          "text-offset": {
            "base": textOffsetBase,
            "stops": [
              [
                textOffsetValuesArray[0].layer,
                [
                  textOffsetValuesArray[0].font[0],
                  textOffsetValuesArray[0].font[1]
                ]
              ],
              [
                textOffsetValuesArray[1].layer,
                [
                  textOffsetValuesArray[1].font[0],
                  textOffsetValuesArray[1].font[1]
                ]
              ]
            ]
          },
          "text-anchor": "top-left", // keep as is for placement on styleguide
          "text-size": {
            "base": textSizeBase,
            "stops": [
              [
                textSizeValuesArray[0].layer,
                textSizeValuesArray[0].font
              ],
              [
                textSizeValuesArray[1].layer,
                textSizeValuesArray[1].font
              ]
            ]
          }
        },
        "paint": {
          "text-halo-width": textHaloWidth,
          "text-halo-color": {
            "base": textHaloColorBase,
            "stops": [
              [
                textHaloColorValuesArray[0].layer,
                textHaloColorValuesArray[0].font
              ],
              [
                textHaloColorValuesArray[1].layer,
                textHaloColorValuesArray[1].font
              ]
            ]
          },
          "text-color": textColor,
          "text-halo-blur": textHaloBlur
        }
      })
    }
    map.setFilter(layer.id, ['==', 'field', 'item' + k]);
  });

  // map.scrollZoom.disable();
});


