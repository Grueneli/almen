/* Hütten rund um Innsbruck */

// Koordinaten Innsbruck
let innsbruck = {
    lat: 47.267222,
    lng: 11.392778,
};

// Karte initialisieren
let map = L.map("map").setView([
    innsbruck.lat, innsbruck.lng
], 12);

map.addControl(new L.Control.Fullscreen({
    title: {
        'false': 'View Fullscreen',
        'true': 'Exit Fullscreen'
    }
}));

//thematische Layer 
let themaLayer = {
    almen: L.featureGroup({disableClusteringAtZoom: 16
            }),
}


// Hintergrundlayer
let layerControl = L.control.layers({
    "BasemapAT Grau": L.tileLayer.provider("BasemapAT.grau").addTo(map),
    "BasemapAT Standard": L.tileLayer.provider("BasemapAT.basemap"),
    "BasemapAT High-DPI": L.tileLayer.provider("BasemapAT.highdpi"),
    "BasemapAT Gelände": L.tileLayer.provider("BasemapAT.terrain"),
    "BasemapAT Oberfläche": L.tileLayer.provider("BasemapAT.surface"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "BasemapAT Beschriftung": L.tileLayer.provider("BasemapAT.overlay")
}, {
    "Hütten": themaLayer.almen.addTo(map),
}).addTo(map);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

//Hütten
async function showHuetten (url) {
    let response = await fetch(url); //Anfrage, Antwort kommt zurück
    let jsondata = await response.json(); //json Daten aus Response entnehmen 
    L.geoJSON(jsondata, {
        pointToLayer: function(feature, latlng) {
            console.log(feature.properties)
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: "icons/alm.png",
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37],
                })
            });
        },
        onEachFeature: function (feature, layer) {
            let prop = feature.properties;
            layer.bindPopup(`      
            <h4> ${prop.NAME} auf ${prop.SEEHOEHE} m Höhe</h4>
            <hr>
            <b>Betreiber:</b> ${prop.BETREIBER} <br>
            <b>geöffnete Monate: </b> ${prop.OFFEN} <br>
            <b>Übernachtungsmöglichkeiten: </b>${prop.UEBERNACHTUNG} <br>
            <a href="${prop.HOMEPAGE}" target="IBK">${prop.HOMEPAGE}</a>

            `);
        }
    }).addTo(themaLayer.almen); //alle Almen anzeigen als Marker
}
//showAlmen ("https://data-tiris.opendata.arcgis.com/datasets/tiris::almzentren-1.geojson"); //aufrufen der Funktion 
showHuetten ("huetten_json.geojson");


