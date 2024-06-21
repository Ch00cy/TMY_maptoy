var map = L.map('map').setView([36.1960, 127.4000], 7);
L.tileLayer('http://localhost:8080/tile/{z}/{x}/{y}.png', {
    minZoom: 7,
    maxZoom: 11,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
}).addTo(map);

function getColor(sidonm) {
    return sidonm == '서울특별시' ? '#edf8b1' :
           sidonm == '부산광역시' ? '#4e09ff' :
           sidonm == '대구광역시' ? '#ffeda0' :
           sidonm == '인천광역시' ? '#2c7fb8' :
           sidonm == '광주광역시' ? '#feb24c' :
           sidonm == '대전광역시' ? '#f03b20' :
           sidonm == '울산광역시' ? '#c51b8a' :
           sidonm == '세종특별자치시' ? '#fa9fb5' :
           sidonm == '경기도' ? '#7fcdbb' :
           sidonm == '강원특별자치도' ? '#fde0dd' :
           sidonm == '충청북도' ? '#fa9fb5' :
           sidonm == '충청남도' ? '#c51b8a' :
           sidonm == '전라북도' ? '#a8ddb5' :
           sidonm == '전라남도' ? '#43a2ca' :
           sidonm == '경상북도' ? '#8856a7' :
           sidonm == '경상남도' ? '#9ebcda' :
           sidonm == '제주특별자치도' ? '#00ffa5' :
           '#FFEDA0'; // 기본 색상
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#ffe629',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();
}

function resetHighlight(e) {
    geojson.resetStyle(e.target); // geojson 객체를 사용하여 스타일 초기화
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

var geojson; // 전역 변수로 geojson 선언

// GeoJSON 파일을 불러와서 스타일링하고 팝업 추가
fetch('/static/data/do/Do.geojson')
    .then(response => response.json())
    .then(geojsonData => {
        geojson = L.geoJson(geojsonData, {
            style: function(feature) {
                return {
                    fillColor: getColor(feature.properties.sidonm),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.3
                };
            },
            onEachFeature: function(feature, layer) {
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: zoomToFeature
                });
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error loading GeoJSON file:', error));

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
