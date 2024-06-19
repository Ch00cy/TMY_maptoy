// 하위 항목 리스트를 토글하는 함수
function toggleChildList(id) {
    var childList = document.getElementById(id);
    if (childList.style.display === 'none' || childList.style.display === '') {
        childList.style.display = 'block';  // 하위 리스트가 보이도록 설정
    } else {
        childList.style.display = 'none';   // 하위 리스트를 숨기도록 설정
    }
}


// 선택된 마커 목록을 업데이트하고, 마커의 아이콘을 변경하는 함수
function updateSelectedMarkers(checked, fullCode, marker) {
    if (checked) {
        if (!selectedMarkers.includes(fullCode)) {
            selectedMarkers.push(fullCode); // 선택된 마커 목록에 추가
        }
        // 선택된 마커 변경
        var currentIcon = marker.options.icon;
        marker.setIcon(L.icon({
            iconUrl: '/static/data/icon/circle-yellow.png',
            iconSize: currentIcon.options.iconSize,
            iconAnchor: currentIcon.options.iconAnchor,
            popupAnchor: currentIcon.options.popupAnchor,
            shadowSize: currentIcon.options.shadowSize,
            shadowAnchor: currentIcon.options.shadowAnchor
        }));
    } else {
        var index = selectedMarkers.indexOf(fullCode);
        if (index > -1) {
            selectedMarkers.splice(index, 1);   // 선택된 마커 목록에서 제거
        }
        marker.setIcon(marker.options.defaultIcon); // 마커의 아이콘은 기본으로 변경
    }
    document.getElementById('markerNames').innerText = selectedMarkers.join(', ');  // 선택된 마커들 이름 표시
}

// 상위 체크박스의 상태를 업데이트하는 함수
function updateParentCheckboxes() {
    var parentCheckboxes = document.querySelectorAll('.parent-checkbox');   // 모든 상위 체크박스 찾음
    parentCheckboxes.forEach(function(parentCheckbox) {
        var childList = parentCheckbox.nextElementSibling.nextElementSibling;   // 상위 체크박스의 다음 다음 요소 (하위 리스트)
        if (childList) {
            var childCheckboxes = childList.querySelectorAll('input[type="checkbox"]'); // 하위 리스트의 모든 체크박스 찾기
            var allChecked = Array.from(childCheckboxes).every(checkbox => checkbox.checked);   // 모든 하위 항목이 체크되었는지?
            var someChecked = Array.from(childCheckboxes).some(checkbox => checkbox.checked);   // 일부 하위 항목이 체크되었는지?

            if (allChecked) {
                parentCheckbox.indeterminate = false;   // 체크 상태가 모호하지 않음
                parentCheckbox.checked = true;  // 상위 체크박스를 체크 상태로 설정
            } else if (someChecked) {
                parentCheckbox.indeterminate = true;    // 체크 상태가 모호함
                parentCheckbox.checked = false; // 상위 체크박스를 체크 해제
            } else {
                parentCheckbox.indeterminate = false;   //   체크 상태 모호하지 않음
                parentCheckbox.checked = false; // 상위 체크박스를 체크해제 상태로 설정
            }
        }
    });
}


// 모든 상위 체크박스에 이벤트 리스너를 추가
document.querySelectorAll('.parent-checkbox').forEach(function(parentCheckbox) {
    parentCheckbox.addEventListener('change', function() {
        var childList = parentCheckbox.nextElementSibling.nextElementSibling;   // 상위 체크박스의 다음 다음 요소 (하위 리스트)
        if (childList) {
            var childCheckboxes = childList.querySelectorAll('input[type="checkbox"]'); // 하위 리스트의 모든 체크박스를 찾음
            if (parentCheckbox.checked) {
                // 상위 체크박스가 체크되면 하위 체크박스들도 모두 체크
                childCheckboxes.forEach(function(childCheckbox) {
                    childCheckbox.checked = true;
                    childCheckbox.dispatchEvent(new Event('change'));   // 상태 변경 이벤트 발생
                });
            } else {
                // 상위 체크박스가 모두 체크 해제 되면 하위 체크박스들도 모두 체크 해제
                childCheckboxes.forEach(function(childCheckbox) {
                    childCheckbox.checked = false;
                    childCheckbox.dispatchEvent(new Event('change'));   // 상태 변경 이벤트 발생
                });
            }
        }
        updateParentCheckboxes();
    });
});

// 1_TMY_700 및 3_TMY_22의 상위 체크박스에 대한 이벤트 리스너 추가
document.querySelectorAll('#1_TMY_78, #3_TMY_22, #1_TMY_measure_6, #2_TMY_measure_48, #3_TMY_model_78').forEach(function(subCheckbox) {
    subCheckbox.addEventListener('change', function() {
        // 체크박스의 다음 다음 요소 (하위 리스트)를 찾음
        var childList = subCheckbox.nextElementSibling.nextElementSibling;
        if (childList) {
            // 하위 리스트의 모든 체크박스를 찾음
            var childCheckboxes = childList.querySelectorAll('input[type="checkbox"]');
            if (subCheckbox.checked) {
                // 체크박스가 체크되면 하위 체크박스들도 모두 체크
                childCheckboxes.forEach(function(childCheckbox) {
                    childCheckbox.checked = true;
                    childCheckbox.dispatchEvent(new Event('change'));   // 상태 변경 이벤트 발생
                });
            } else {
                // 체크박스가 체크 해제되면 하위 체크박스들도 모두 체크 해제
                childCheckboxes.forEach(function(childCheckbox) {
                    childCheckbox.checked = false;
                    childCheckbox.dispatchEvent(new Event('change'));   // 상태 변경 이벤트 발생
                });
            }
        }
        updateParentCheckboxes();   // 상위 체크박스 상태 업데이트 
    });
});

// 모든 토글 버튼에 이벤트 리스너를 추가
document.querySelectorAll('.toggle-button').forEach(function(toggleButton) {
    toggleButton.addEventListener('click', function() {
        // 토글 버튼의 부모 요소 내 하위 리스트를 찾음
        var childList = toggleButton.parentElement.querySelector('.child-list');
        if (childList.style.display === 'none' || childList.style.display === '') {
            childList.style.display = 'block';  // 하위 리스트가 숨겨져 있는 경우 보이도록 설정
            toggleButton.innerHTML = '▼';   // 버튼 텍스트 설변경
        } else {
            childList.style.display = 'none';   // 하위 리스트가 보이는 경우 숨기도록 설정
            toggleButton.innerHTML = '▶';   // 버튼 텍스트 변경
        }
    });
});

// 초기화 함수
function initializeCheckboxes() {
    updateParentCheckboxes(); // 상위 체크박스 상태 업데이트
}

// 초기화 함수 호출
initializeCheckboxes();
