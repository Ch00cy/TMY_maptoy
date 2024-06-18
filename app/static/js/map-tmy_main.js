var icon_size = 10;

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

    switch (currentZoom){
        case 7:
            newSize = [10, 10];
            break;
        case 8:
            newSize = [14, 14];
            break;
        case 9:
            newSize = [18, 18];
            break;
        case 10:
            newSize = [22, 22];
            break;
        case 11:
            newSize = [26, 26];
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

// GeoJSON 파일 로드
var geojsonData;
fetch('app/static/data/do/Do.geojson')
    .then(response => response.json())
    .then(data => {
        geojsonData = data;
    })
    .catch(error => console.error('Error loading GeoJSON:', error));

// 지도에 마커를 추가하는 함수
// 폴더, 하위폴더, site_file.csv 파일 -> 마커 데이터 -> 지도에 추가 -> 체크리스트
function addMarkers(folder, subfolder, siteFile) {   
    // CSV 파일을 가져오기 위한 fetch 요청
    fetch(siteFile) // siteFile 경로 -> 데이터 가져옴
        .then(response => { // 응답 성공 여부
            if (!response.ok) { // 응답이 성공적이지 않을 경우 오류 발생
                throw new Error('Network response was not ok ' + response.statusText);
            }
            // 응답을 텍스트로 변환하여 반환
            return response.text();
        })
        .then(data => {
            // PapaParse 라이브러리를 사용하여 CSV 데이터를 파싱
            Papa.parse(data, {
                header: true,   // 첫 번째 행을 헤더로 사용 -> 데이터를 객체 배열
                complete: function(results) {
                    var markersData = results.data; // 파싱된 데이터 배열

                    // 2021_100 폴더에 대한 예외 처리
                    if (folder === '2022_200') {
                        // 2021_100 외의 폴더에 대한 처리
                        var checklist = document.getElementById(folder + '_list');

                        markersData.forEach(function(markerData, index) {
                            var lat = parseFloat(markerData.latitude);  // 위도
                            var lng = parseFloat(markerData.longitude); // 경도
                            var code = markerData.code || markerData.Code || markerData['Marker Code']; 
                            var fullCode = folder + '+' + code; // 마커 이름 출력할 때 사용 , 데이터 이름 구분짓기 위해

                            // 유효하지 않은 데이터 -> 건너뜀
                            if (!lat || !lng || !code) {
                                console.error('Invalid data: ', markerData);
                                return;
                            }

                            // 마커 생성 -> 지도 추가
                            var marker = L.marker([lat, lng], { 
                                icon: icons[folder],    // 폴더 안의 아이콘 사용
                                defaultIcon: icons[folder] // 기본 아이콘 저장
                            }).addTo(map);
                            markers[fullCode] = marker; // 마커를 markers 객체에 저장

                            // 체크리스트 항목 생성
                            var listItem = document.createElement('li');    // 새로운 리스트 항목 (li) 요소 생성
                            // 체크박스 생성
                            var checkbox = document.createElement('input'); // 새로운 입력 (input) 요소 생성
                            checkbox.type = 'checkbox'; // 입력 요소 타입 설정 -> 체크박스 만듬
                            checkbox.id = fullCode; // 체크박스 ID
                            checkbox.value = code;  // 체크박스 값
                            checkbox.className = 'marker-checkbox'; // 체크박스 클래스 이름
                            // 라벨 생성
                            var label = document.createElement('label');    // 새로운 라벨 (label) 요소 생성
                            label.htmlFor = fullCode;   // 라벨 for 속성 : 체크박스 id와 동일 -> 라벨 클릭 시 체크박스 선택됨
                            label.appendChild(document.createTextNode(code));   // 라벨 요소에 텍스트 노드 추가 <- 마커 code

                            // 리스트 항목에 체그박스와 라벨 추가
                            listItem.appendChild(checkbox); // 리스트 항목 (li) 요소에 체크박스 (input) 요소를 자식 요소로 추가
                            listItem.appendChild(label);    // 리스트 항목 (li) 요소에 라벨 (label) 요소를 자식 요소로 추가
                            // 최종적 : 체크리스트 <- 리스트 항목 추가
                            checklist.appendChild(listItem);    // 기존 체크리스트 checklist 에 새로만든 리스트항목 (li) 추가

                            // 체그박스 상태 변경 시 마커의 색상 업데이트
                            checkbox.addEventListener('change', function(e) {
                                updateSelectedMarkers(e.target.checked, fullCode, marker);
                                updateParentCheckboxes();
                            });

                            // 마커 클릭 시 체크박스 상태 변경
                            marker.on('click', function() {
                                var checkbox = document.getElementById(fullCode);
                                checkbox.checked = !checkbox.checked;
                                updateSelectedMarkers(checkbox.checked, fullCode, marker);
                                updateParentCheckboxes();
                            });
                        });

                    } else {
                        // 상위 체크리스트 항목 : 2021_100 리스트 요소 가져옴
                        var parentChecklist = document.getElementById(folder + '_list');

                        // 하위 폴더 체크리스트 항목 ID 생성
                        var subfolderListId = folder + '_' + subfolder + '_list';
                        var subfolderList = document.getElementById(subfolderListId);
                        
                        // 하위 폴더 리스트가 존재하지 않으면 생성합니다.
                        if (!subfolderList) {
                            // 하위 폴더 항목 생성
                            var subfolderItem = document.createElement('li');

                            // 하위 폴더 토글 버튼 생성
                            var subfolderToggleButton = document.createElement('span');
                            subfolderToggleButton.className = 'toggle-button';
                            subfolderToggleButton.onclick = function() { toggleChildList(subfolderListId); };
                            subfolderToggleButton.innerText = '▶';
                            subfolderItem.appendChild(subfolderToggleButton);

                            // 하위 폴더 레이블 생성
                            var subfolderLabel = document.createElement('label');
                            subfolderLabel.htmlFor = subfolderListId;
                            subfolderLabel.innerText = subfolder;
                            subfolderItem.appendChild(subfolderLabel);

                            // 하위 폴더 리스트 생성
                            subfolderList = document.createElement('ul');
                            subfolderList.id = subfolderListId;
                            subfolderList.className = 'child-list';
                            subfolderItem.appendChild(subfolderList);

                            parentChecklist.appendChild(subfolderItem);
                            
                        }

                        // 각 마커 데이터를 처리
                        markersData.forEach(function(markerData, index) { 
                            // 위도와 경도, 코드 값을 추출
                            var lat = parseFloat(markerData.latitude);  // 위도
                            var lng = parseFloat(markerData.longitude); // 경도
                            var code = markerData.code || markerData.Code || markerData['Marker Code']; // 코드
                            var fullCode = folder + '+' + subfolder + '+' + code;   // 전체 코드

                            // 위도, 경도, 코드 값이 유효하지 않으면 오류 발생 
                            if (!lat || !lng || !code) {
                                console.error('Invalid data: ', markerData);
                                return;
                            }

                            // 마커 생성 및 지도에 추가
                            var marker = L.marker([lat, lng], { 
                                icon: icons[folder],    // 폴더 안의 아이콘
                                defaultIcon: icons[folder] // 기본 아이콘 저장
                            }).addTo(map);
                            markers[fullCode] = marker; // 마커를 markers 객체에 저장

                            // 체크리스트 항목 생성
                            var listItem = document.createElement('li');
                            var checkbox = document.createElement('input');
                            checkbox.type = 'checkbox';
                            checkbox.id = fullCode;
                            checkbox.value = code;
                            checkbox.className = 'marker-checkbox';
                            var label = document.createElement('label');
                            label.htmlFor = fullCode;
                            label.appendChild(document.createTextNode(code));

                            listItem.appendChild(checkbox);
                            listItem.appendChild(label);
                            subfolderList.appendChild(listItem);

                            // 체크박스 상태 변경 시 마커 색상 변경
                            checkbox.addEventListener('change', function(e) {
                                updateSelectedMarkers(e.target.checked, fullCode, marker);
                                updateParentCheckboxes();
                            });

                            // 마커 클릭 시 체크박스 상태 변경
                            marker.on('click', function() {
                                var checkbox = document.getElementById(fullCode);
                                checkbox.checked = !checkbox.checked;
                                updateSelectedMarkers(checkbox.checked, fullCode, marker);
                                updateParentCheckboxes();
                            });
                        });
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching the CSV file:', error));
}

// 마커를 추가하기 위한 호출
addMarkers('2021_100', '1_TMY_78', '/static/data/data_TMY/2021_100/1_TMY_78/1_site_info.csv');
addMarkers('2021_100', '3_TMY_22', '/static/data/data_TMY/2021_100/3_TMY_22/3_site_info.csv');
addMarkers('2022_200', '', '/static/data/data_TMY/2022_200/site_info.csv');
addMarkers('2023_700', '1_TMY_measure_6', '/static/data/data_TMY/2023_700/1_TMY_measure_6/site_info.csv');
addMarkers('2023_700', '2_TMY_measure_48', '/static/data/data_TMY/2023_700/2_TMY_measure_48/site_info.csv');
addMarkers('2023_700', '3_TMY_model_78', '/static/data/data_TMY/2023_700/3_TMY_model_78/site_info.csv');