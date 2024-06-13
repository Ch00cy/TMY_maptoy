var map = L.map('map').setView([36.1960, 127.4000], 7);
L.tileLayer('http://localhost:8080/tile/{z}/{x}/{y}.png', {
    minZoom: 7,
    maxZoom: 11,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);

var maxBounds = L.latLngBounds(
    L.latLng(33.0, 125.0),
    L.latLng(38.5, 132.0)
);
map.setMaxBounds(maxBounds);

var markers = {};
var selectedMarkers = [];

var icons = {
    '2021_100': L.icon({
        iconUrl: '/static/data/icon/green-dot.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    }),
    '2022_200': L.icon({
        iconUrl: '/static/data/icon/pink-dot.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    }),
    '2023_700': L.icon({
        iconUrl: '/static/data/icon/blue-dot.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    })
};
