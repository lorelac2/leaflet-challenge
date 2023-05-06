// Store API endpoint as queryURL
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });
  
  function createFeatures(earthquakeData) {

    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }
    // Change the color of the circlemarkers
    function getColor(feature) {
        let d = feature.geometry.coordinates[2]
        if (d < 10) {
            color = "green";
          }
          else if (d <= 30) {
            color = "yellow";
          }
          else if (d <= 50) {
            color = "orange";
          }
          else if (d <= 70) {
            color = "red"; 
          }
          else if (d <= 90) {
            color = "darkred";
          }
          else {
            color = "maroon";
          }
          return color;
        }
    

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, coordinates) {
        return L.circleMarker(coordinates, {
            color: getColor(feature)
        });
      }
    });
  
 // Send our earthquakes layer to the createMap function/
 createMap(earthquakes);
  }

  function createMap(earthquakes) {
 // Create the base layers.
 var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

   // Set up the legend.
   var legend = L.control({ position: "bottomright" });
   legend.onAdd = function() {
     var div = L.DomUtil.create("div", "info legend");
     var grades = [10, 30, 50, 70, 90];
     var labels = ["0-10", "10-30", "30-50", "50-70", "70-90"];
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background: ' + 
              '"></i> ' +
              grades[i] +
              (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+")
    }
     return div;
};

// Add legend to map
legend.addTo(myMap);

  }
//Acknowledgement that code source for creating the map was found in Day 1 Activities in Module 15 
