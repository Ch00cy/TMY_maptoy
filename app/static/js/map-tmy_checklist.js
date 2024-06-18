// 하위 항목 리스트를 토글하는 함수
function toggleChildList(id) {
    var childList = document.getElementById(id); // 주어진 ID를 가진 요소를 찾습니다.
    // 현재 하위 항목 리스트의 표시 상태를 토글합니다.
    if (childList.style.display === 'none' || childList.style.display === '') {
        childList.style.display = 'block'; // 하위 리스트를 보이도록 설정
    } else {
        childList.style.display = 'none'; // 하위 리스트를 숨기도록 설정
    }
}

// 선택된 마커 목록을 업데이트하고, 마커의 아이콘을 변경하는 함수
function updateSelectedMarkers(checked, fullCode, marker) {
    if (checked) {
        if (!selectedMarkers.includes(fullCode)) {
            selectedMarkers.push(fullCode); // 선택된 마커 목록에 추가
        }
        // 마커의 아이콘을 노란색 점으로 변경
        marker.setIcon(L.icon({
            iconUrl: '/static/data/icon/yellow-dot.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        }));
    } else {
        var index = selectedMarkers.indexOf(fullCode);
        if (index > -1) {
            selectedMarkers.splice(index, 1); // 선택된 마커 목록에서 제거
        }
        // 마커의 아이콘을 기본 아이콘으로 변경
        marker.setIcon(marker.options.defaultIcon);
    }
    // 선택된 마커들의 이름을 표시
    document.getElementById('markerNames').innerText = selectedMarkers.join(', ');
}

// 상위 체크박스의 상태를 업데이트하는 함수
function updateParentCheckboxes() {
    var parentCheckboxes = document.querySelectorAll('.parent-checkbox'); // 모든 상위 체크박스를 찾습니다.
    parentCheckboxes.forEach(function(parentCheckbox) {
        var childList = parentCheckbox.nextElementSibling.nextElementSibling; // 상위 체크박스의 다음 다음 요소 (하위 리스트)
        if (childList) {
            var childCheckboxes = childList.querySelectorAll('input[type="checkbox"]'); // 하위 리스트의 모든 체크박스를 찾습니다.
            var allChecked = Array.from(childCheckboxes).every(checkbox => checkbox.checked); // 모든 하위 체크박스가 체크되었는지 확인
            var someChecked = Array.from(childCheckboxes).some(checkbox => checkbox.checked); // 일부 하위 체크박스가 체크되었는지 확인

            if (allChecked) {
                parentCheckbox.indeterminate = false; // 체크 상태가 모호하지 않음
                parentCheckbox.checked = true; // 상위 체크박스를 체크 상태로 설정
            } else if (someChecked) {
                parentCheckbox.indeterminate = true; // 체크 상태가 모호함
                parentCheckbox.checked = false; // 상위 체크박스를 체크 해제 상태로 설정
            } else {
                parentCheckbox.indeterminate = false; // 체크 상태가 모호하지 않음
                parentCheckbox.checked = false; // 상위 체크박스를 체크 해제 상태로 설정
            }
        }
    });
}

// 모든 상위 체크박스에 이벤트 리스너를 추가
document.querySelectorAll('.parent-checkbox').forEach(function(parentCheckbox) {
    parentCheckbox.addEventListener('change', function() {
        var childList = parentCheckbox.nextElementSibling.nextElementSibling; // 상위 체크박스의 다음 다음 요소 (하위 리스트)
        if (childList) {
            var childCheckboxes = childList.querySelectorAll('input[type="checkbox"]'); // 하위 리스트의 모든 체크박스를 찾습니다.
            if (parentCheckbox.checked) {
                // 상위 체크박스가 체크되면 하위 체크박스들도 모두 체크
                childCheckboxes.forEach(function(childCheckbox) {
                    childCheckbox.checked = true;
                    childCheckbox.dispatchEvent(new Event('change')); // 상태 변경 이벤트 발생
                });
            } else {
                // 상위 체크박스가 체크 해제되면 하위 체크박스들도 모두 체크 해제
                childCheckboxes.forEach(function(childCheckbox) {
                    childCheckbox.checked = false;
                    childCheckbox.dispatchEvent(new Event('change')); // 상태 변경 이벤트 발생
                });
            }
        }
    });
});

// 모든 토글 버튼에 이벤트 리스너를 추가
document.querySelectorAll('.toggle-button').forEach(function(toggleButton) {
    toggleButton.addEventListener('click', function() {
        var childList = toggleButton.parentElement.querySelector('.child-list'); // 토글 버튼의 부모 요소 내 하위 리스트
        if (childList.style.display === 'none' || childList.style.display === '') {
            childList.style.display = 'block'; // 하위 리스트를 보이도록 설정
            toggleButton.innerHTML = '▼'; // 버튼 텍스트 변경
        } else {
            childList.style.display = 'none'; // 하위 리스트를 숨기도록 설정
            toggleButton.innerHTML = '▶'; // 버튼 텍스트 변경
        }
    });
});
