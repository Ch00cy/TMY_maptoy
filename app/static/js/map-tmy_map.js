var map = L.map('map').setView([36.1960, 127.4000], 7);
L.tileLayer('http://localhost:8080/tile/{z}/{x}/{y}.png', {
    minZoom: 7,
    maxZoom: 11,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);

// // GeoJSON 파일을 불러와서 스타일링하고 팝업 추가
// fetch('/static/data/do/Do.geojson')
//     .then(response => response.json())
//     .then(geojsonData => {
//         L.geoJson(geojsonData, {
//             style: function(feature) {
//                 return {
//                     color: '#ff7800',
//                     weight: 2,
//                     opacity: 1,
//                     fillOpacity: 0.2
//                 };
//             },
//             onEachFeature: function(feature, layer) {
//                 if (feature.properties && feature.properties.name) {
//                     layer.bindPopup(feature.properties.name);
//                 }
//             }
//         }).addTo(map);
//     })
//     .catch(error => console.error('Error loading GeoJSON file:', error));

var maxBounds = L.latLngBounds(
    L.latLng(33.0, 125.0),
    L.latLng(38.5, 132.0)
);
map.setMaxBounds(maxBounds);

var markers = {};
var selectedMarkers = [];

var icon_size = 8; // 마커 아이콘 크기

var icons = {
    '2021_100': L.icon({
        iconUrl: '/static/data/icon/circle-blue.png',
        iconSize: [icon_size, icon_size]
    }),
    '2022_200': L.icon({
        iconUrl: '/static/data/icon/circle-red.png',
        iconSize: [icon_size, icon_size]
    }),
    '2023_700': L.icon({
        iconUrl: '/static/data/icon/circle-pink.png',
        iconSize: [icon_size, icon_size]
    })
};

map.on('zoomend', function() {
    var currentZoom = map.getZoom();
    var newSize;

    switch (currentZoom) {
        case 7:
            newSize = [8, 8];
            break;
        case 8:
            newSize = [12, 12];
            break;
        case 9:
            newSize = [18, 18];
            break;
        case 10:
            newSize = [22, 22];
            break;
        case 11:
            newSize = [28, 28];
            break;
    }

    for (var key in markers) {
        if (markers.hasOwnProperty(key)) {
            var marker = markers[key];
            var icon = marker.options.icon;
            icon.options.iconSize = newSize;
            marker.setIcon(icon);
        }
    }
});
