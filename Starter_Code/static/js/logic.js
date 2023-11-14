// URL 

const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Performing GET request to the query URL

d3.json(url).then(function (data) {
    
    console.log(data);
    createFeatures(data.features);
    });
    
    // Function to determine marker size 
    function markerSize(mag) {
        
        return mag * 10000; 
    }
    
    // Color circles based on depth
    function chooseColor(depth){
        
        var color;
    
        if (depth < 10) color =  "#00FF00";
        else if (depth < 30) color =  "green";
        else if (depth < 50) color =  "yellow";
        else if (depth < 70) color =  "orange";
        else if (depth < 90) color =  "orangered";
        else color =  "red";
    
        console.log(' depth : ', depth, ' color : ',color);
        return color;
        
      }
          
    function createFeatures(earthquakeData) {
    
        // Defining function
        
        function onEachFeature(feature, layer) {
          layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
        }
      
        // Creating GeoJSON layer.
        
        var earthquakes = L.geoJSON(earthquakeData, {
          onEachFeature: onEachFeature,
      
          // Pointtolayer used to alter markers
          pointToLayer: function(feature, latlng) {
      
            // Setting up the styling 
            var markers = {
              radius: markerSize(feature.properties.mag),
              fillColor: chooseColor(feature.geometry.coordinates[2]),
              fillOpacity: 0.5,
              color: "white",
              stroke: true,
              weight: 1.5
            }
            return L.circle(latlng,markers);
          }
        });
    
          // Create Map function(earthquakes)
      createMap(earthquakes);
    }
    
    function createMap(earthquakes) {
    
        // Map background - Layers
        let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        // Set up an overlay object
        var overlayMaps = {
        Earthquakes: earthquakes
        };
        // Creating map 
        var myMap = L.map("map", {
          center: [46.53, -100.78],
          zoom: 4,
          layers: [streetmap, earthquakes]
        });
      
        // Set up the legend 
        var legend = L.control({position: "bottomright"});
          
        // Adding the legend to the map
        legend.onAdd = function () {
            var div = L.DomUtil.create("div", "info legend");
            var depth = [-10, 10, 30, 50, 70, 90];
        
            div.innerHTML += "<h3 style='text-align: center'>Depth</h3>";
        
            for (var i = 0; i < depth.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + chooseColor(depth[i] + 1) + '; width: 20px; height: 20px; display: inline-block;"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
            }
            return div;
        };
          legend.addTo(myMap)
          
         
      };
