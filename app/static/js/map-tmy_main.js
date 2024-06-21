// 행정구역 체크리스트 추가
var donames = {
    '서울특별시': 'seoul_list',
    '부산광역시': 'busan_list',
    '대구광역시': 'daegu_list',
    '인천광역시': 'incheon_list',
    '광주광역시': 'gwangju_list',
    '대전광역시': 'daejeon_list',
    '울산광역시': 'ulsan_list',
    '세종특별자치시': 'sejong_list',
    '경기도': 'gyeonggi_list',
    '강원특별자치도': 'gangwon_list',
    '충청북도': 'chungbuk_list',
    '충청남도': 'chungnam_list',
    '전라북도': 'jeonbuk_list',
    '전라남도': 'jeonnam_list',
    '경상북도': 'gyeongbuk_list',
    '경상남도': 'gyeongnam_list',
    '제주특별자치도': 'jeju_list'
};

// 지도에 마커를 추가하는 함수
function addMarkers(folder, subfolder, siteFile) {
    fetch(siteFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            Papa.parse(data, {
                header: true,
                complete: function(results) {
                    var markersData = results.data;

                    var parentChecklist = document.getElementById(folder + '_list');
                    var subfolderListId = folder + (subfolder ? '_' + subfolder : '') + '_list';
                    var subfolderList = document.getElementById(subfolderListId);

                    if (!subfolderList) {
                        var subfolderItem = document.createElement('li');
                        
                        var subfolderToggleButton = document.createElement('span');
                        subfolderToggleButton.className = 'toggle-button';
                        subfolderToggleButton.onclick = function() { toggleChildList(subfolderListId); };
                        subfolderToggleButton.innerText = '▶';
                        subfolderItem.appendChild(subfolderToggleButton);

                        var subfolderCheckbox = document.createElement('input');
                        subfolderCheckbox.type = 'checkbox';
                        subfolderCheckbox.id = subfolderListId + '_checkbox';
                        subfolderCheckbox.className = 'parent-checkbox';
                        subfolderCheckbox.addEventListener('change', function() {
                            var childList = subfolderCheckbox.nextElementSibling.nextElementSibling; // 하위 리스트
                            if (childList) {
                                var childCheckboxes = childList.querySelectorAll('input[type="checkbox"]');
                                if (subfolderCheckbox.checked) {
                                    // 상위 체크박스가 체크되면 하위 체크박스들도 모두 체크
                                    childCheckboxes.forEach(function(childCheckbox) {
                                        childCheckbox.checked = true;
                                        childCheckbox.dispatchEvent(new Event('change')); // 상태 변경 이벤트 발생
                                    });
                                } else {
                                    // 상위 체크박스가 모두 체크 해제 되면 하위 체크박스들도 모두 체크 해제
                                    childCheckboxes.forEach(function(childCheckbox) {
                                        childCheckbox.checked = false;
                                        childCheckbox.dispatchEvent(new Event('change')); // 상태 변경 이벤트 발생
                                    });
                                }
                            }
                            updateParentCheckboxes();
                        });
                        subfolderItem.appendChild(subfolderCheckbox);

                        var subfolderLabel = document.createElement('label');
                        subfolderLabel.htmlFor = subfolderListId + '_checkbox';
                        subfolderLabel.innerText = subfolder ? subfolder : folder;
                        subfolderItem.appendChild(subfolderLabel);

                        subfolderList = document.createElement('ul');
                        subfolderList.id = subfolderListId;
                        subfolderList.className = 'child-list';
                        subfolderItem.appendChild(subfolderList);

                        parentChecklist.appendChild(subfolderItem);
                    }

                    markersData.forEach(function(markerData) {
                        var lat = parseFloat(markerData.latitude);
                        var lng = parseFloat(markerData.longitude);
                        var doname = markerData.sidonm;
                        var code = markerData.code || markerData.Code || markerData['Marker Code'];
                        var fullCode = folder + (subfolder ? '+' + subfolder : '') + '+' + code;

                        if (!lat || !lng || !code || !doname) {
                            console.error('Invalid data: ', subfolder);
                            return;
                        }   

                        var marker = L.marker([lat, lng], {
                            icon: icons[folder],
                            defaultIcon: icons[folder]
                        }).addTo(map);
                        markers[fullCode] = marker;
                        
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

                        checkbox.addEventListener('change', function(e) {
                            updateSelectedMarkers(e.target.checked, fullCode, marker);
                            updateParentCheckboxes();
                        });

                        marker.on('click', function() {
                            var checkbox = document.getElementById(fullCode);
                            checkbox.checked = !checkbox.checked;
                            updateSelectedMarkers(checkbox.checked, fullCode, marker);
                            updateParentCheckboxes();
                        });

                        // 행정구역 체크리스트에 추가
                        if (doname && donames[doname]) {
                            var donameList = document.getElementById(donames[doname]);

                            if (donameList) {
                                var donameListItem = document.createElement('li');

                                var donameCheckbox = document.createElement('input');
                                donameCheckbox.type = 'checkbox';
                                donameCheckbox.id = 'doname_' + fullCode;
                                donameCheckbox.value = code;
                                donameCheckbox.className = 'marker-checkbox';

                                var donameLabel = document.createElement('label');
                                donameLabel.htmlFor = 'doname_' + fullCode;
                                donameLabel.appendChild(document.createTextNode(code));

                                donameListItem.appendChild(donameCheckbox);
                                donameListItem.appendChild(donameLabel);
                                donameList.appendChild(donameListItem);

                                donameCheckbox.addEventListener('change', function(e) {
                                    updateSelectedMarkers(e.target.checked, fullCode, marker);
                                    updateParentCheckboxes();
                                });

                                marker.on('click', function() {
                                    var donameCheckbox = document.getElementById('doname_' + fullCode);
                                    donameCheckbox.checked = !donameCheckbox.checked;
                                    updateSelectedMarkers(donameCheckbox.checked, fullCode, marker);
                                    updateParentCheckboxes();
                                });
                            }
                        }
                    });
                }
            });
        })
        
        .catch(error => console.error('Error fetching the CSV file:', subfolder));
}

// 마커를 추가하기 위한 호출
addMarkers('2021_100', '1_TMY_78', '/static/data/data_TMY/2021_100/1_TMY_78/1_site_info.csv');
addMarkers('2021_100', '3_TMY_22', '/static/data/data_TMY/2021_100/3_TMY_22/3_site_info.csv');
addMarkers('2022_200', '', '/static/data/data_TMY/2022_200/site_info.csv');
addMarkers('2023_700', '1_TMY_measure_6', '/static/data/data_TMY/2023_700/1_TMY_measure_6/site_info.csv');
addMarkers('2023_700', '2_TMY_measure_48', '/static/data/data_TMY/2023_700/2_TMY_measure_48/site_info.csv');
addMarkers('2023_700', '3_TMY_model_700', '/static/data/data_TMY/2023_700/3_TMY_model_700/site_info.csv');
