var mapboxAccessToken = "pk.eyJ1IjoiamVubmllY2luZWxsaSIsImEiOiJja3F4d3VpMXEwdThnMnhxeXd6czhvNDByIn0.RVdoXt5ylCwQgYW7Z3WyBA";
var map = L.map('map').setView([42, -100], 4);
// add light tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
}).addTo(map);

// //  add states data to the map
L.geoJson(statesData).addTo(map);

var state_predict_url = "/api/statepredictions";

function getColor(d) {
return d < 150000  ? "#cdebf9":
        d < 200000 ? "#89CFF1":
        d < 300000 ? "#6EB1D6":
        d < 400000 ? "#5293BB":
        d < 500000 ? "#3776A1":
        d < 600000 ? "#1B5886":
        d > 600000 ? "#003A6B":
                        "#003A6B"                                   
}     

function makeLegend(map) {
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        // create a div for the legend
        var div = L.DomUtil.create('div', 'info legend');
            div.innerHTML += "<p>Predicted Home Price</p>";
            grades = [150000, 200000, 300000, 400000, 500000, 600000, 700000]
            labels = [];
            grades1 = ["< $150,000", "< $200,000", "< $300,000", "< $400,000", "< $500,000", "< $600,000", "$600,000+"]
    
        
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] - 1) + '"></i> ' + 
                grades1[i] + '<br>' ;
        }        
        return div;
    };
    
      legend.addTo(map);
}

function makeMap(year) {
    return new Promise((resolve, reject) => {
    d3.json(state_predict_url).then(function(data) {

        for (var i=0; i<data.length; i++) {
            for (var j=0; j < statesData.features.length; j++) {
                if (data[i].state === statesData.features[j].properties.name & statesData.features[j].properties.year == 2021) {
                statesData.features[j].properties.price = data[i].dec_2021_predicted;
                }
                if (data[i].state === statesData.features[j].properties.name & statesData.features[j].properties.year == 2025) {
                statesData.features[j].properties.price = data[i].dec_2025_predicted;
                }
                if (data[i].state === statesData.features[j].properties.name & statesData.features[j].properties.year == 2030) {
                statesData.features[j].properties.price = data[i].dec_2030_predicted;
                }
            };
        }

        for (var i=0; i < statesData.features.length; i++) {
            statesData.features[i].properties.year = year;
        }

        // create style function 
        function style(feature) {
            return {
                fillColor: getColor(feature.properties.price),
                weight: 1,
                opacity: 0.8,
                color: 'white',
                fillOpacity: 0.7
            };
        }
        
        // add mouseover event for each feature to style and show popup
        function onEachFeature(feature, layer) {
            layer.on('mouseover', function(e) {
                layer.setStyle({
                    dashArray: '',
                    fillOpacity: 1
                });

                    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                        this.bringToFront();
                    }
                    layer.openPopup();
                }).on('mouseout', function(e) {
                    layer.closePopup();
                });
            
            // create the popup variable
            var popup = "<h3>" + (feature.properties.name) + "</h3>" + 
            "<p><strong>Predicted Median Price: </strong>" + feature.properties.price + "</p>";
            // add the popup to the map and set location
            layer.bindPopup(popup, { className: 'popup', 'offset': L.point(0, -20) });
        }

        //  add the style and onEachFeature function to the map
        resolve(geojson = L.geoJson(statesData, {
            style: style,
            onEachFeature: onEachFeature
        }))
        // .addTo(map);
    });
})}

Promise.all([makeMap(2021), makeMap(2025), makeMap(2030)]).then(layers => {
    var layer_2021 = layers[1]
    var layer_2025 = layers[2]
    var layer_2030 = layers[0]
 
    var baseMaps = {
        2021: layer_2021,
        2025: layer_2025,
        2030: layer_2030
    }

    layer_2021.addTo(map);
    makeLegend(map);

    L.control.layers(baseMaps).addTo(map)
})