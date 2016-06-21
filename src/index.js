var fs = require('fs');
var mapboxgl = require('mapbox-gl');

// styles to turn into data
var button = document.getElementById('theButton');
var user, styleID, accessToken, style;

button.addEventListener('click', function() {
  user = document.getElementById('user').value;
  styleID = document.getElementById('styleID').value;
  accessToken = document.getElementById('accessToken').value;
  if(user === '') {
    alert('Input your Mapbox username, then click submit.');
  } else if(styleID === '') {
    alert('Input the styleID for the map you wish to see.');
  } else if(accessToken === '') {
    alert('Input your Mapbox accessToken.');
  } else {
      var styleJSON = 'https://api.mapbox.com/styles/v1/' + user + '/' + styleID + '?access_token=' + accessToken;
      loadJSON(styleJSON,
         function(styleParse) {
          // console.log('but we do have ' + styleParse);
          style = styleParse;
          addMap(style);
        },
         function(xhr) { console.error(xhr); }
      );
    }
  });

// now generate the new style.json
function addMap() {
  // run function only when we have all the values
  var generate = require('./generate.js');
  // generate new data from style.json
  var generate_data = generate(style);
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

  var hideForm = document.getElementById('theForm');
  var showMap = document.getElementById('map');
  hideForm.className = 'hidden';
  showMap.className = '';
  // console.log('did this happen?');
  // console.log(generate_data.features);
  console.log(style);

  mapboxgl.accessToken = accessToken;
  var map = new mapboxgl.Map({
    container: 'map',
    style: style,
    hash: true,
    zoom: 4.73,
    center: [-110.9757,47.949]
  });
}

// read style.json url
function loadJSON(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}


