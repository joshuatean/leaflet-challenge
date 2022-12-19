let api_data = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

let myMap = L.map("map", {
    center: [2.7, 123.95],
    zoom: 3,
});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

d3.json(api_data).then(function (data)  {

    function depthColour(depth) {
        if (depth > 90) {
            color = "#765789";
        } else if (depth > 70) {
            color = "#e38f8c";
        } else if (depth > 50) {
            color = "#c76b8f";
        } else if (depth > 30) {
            color = "#dc828e";
        } else if (depth > 10) {
            color = "#ec988e";
        } else if (depth >= -10){
            color = "#ffcc99";
        }
        return color;
    }

    function makeCircles(feature, latlng) {
        var markers = {
            radius: (4 * feature.properties.mag),
            fillColor: depthColour(feature.geometry.coordinates[2]),
            color: "#000000",
            weight: 1.0,
            opacity: 1.5,
            fillOpacity: 1
        };
        return L.circleMarker(latlng, markers);
    }
    
    // Define a function and create a popup with description
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    L.geoJSON(data, {
        pointToLayer: makeCircles,
        onEachFeature: onEachFeature
    }).addTo(myMap);


    // Information Box
    var infobox = L.control({ position: "bottomright" });

    infobox.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    let ranges = [-10, 10, 30, 50, 70, 90];
    let colours = [
    "#ffcc99",
    "#ec988e",
    "#dc828e",
    "#c76b8f",
    "#e38f8c",
    "#765789",
    ];
    for (let i = 0; i < ranges.length; i++) {
    div.innerHTML +=
        "<i style='background: " +
        colours[i] +
        "'></i> " +
        ranges[i] +
        (ranges[i + 1] ? "&ndash;" + ranges[i + 1] + "<br>" : "+");
    }
    return div;
    };
   
    infobox.addTo(myMap);
});