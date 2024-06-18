// 하위 항목 리스트를 토글하는 함수
function toggleChildList(id) {
    var childList = document.getElementById(id);
    if (childList.style.display === 'none' || childList.style.display === '') {
        childList.style.display = 'block';
    } else {
        childList.style.display = 'none';
    }
}

// 선택된 마커 목록을 업데이트하고, 마커의 아이콘을 변경하는 함수
function updateSelectedMarkers(checked, fullCode, marker) {
    if (checked) {
        if (!selectedMarkers.includes(fullCode)) {
            selectedMarkers.push(fullCode);
        }
        marker.setIcon(L.icon({
            iconUrl: '/static/data/icon/yellow-dot.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        }));
    } else {
        var index = selectedMarkers.indexOf(fullCode);
        if (index > -1) {
            selectedMarkers.splice(index, 1);
        }
        marker.setIcon(marker.options.defaultIcon);
    }
    document.getElementById('markerNames').innerText = selectedMarkers.join(', ');
}

// 상위 체크박스의 상태를 업데이트하는 함수
function updateParentCheckboxes() {
    var parentCheckboxes = document.querySelectorAll('.parent-checkbox');
    parentCheckboxes.forEach(function(parentCheckbox) {
        var childList = parentCheckbox.nextElementSibling.nextElementSibling;
        if (childList) {
            var childCheckboxes = childList.querySelectorAll('input[type="checkbox"]');
            var allChecked = Array.from(childCheckboxes).every(checkbox => checkbox.checked);
            var someChecked = Array.from(childCheckboxes).some(checkbox => checkbox.checked);

            if (allChecked) {
                parentCheckbox.indeterminate = false;
                parentCheckbox.checked = true;
            } else if (someChecked) {
                parentCheckbox.indeterminate = true;
                parentCheckbox.checked = false;
            } else {
                parentCheckbox.indeterminate = false;
                parentCheckbox.checked = false;
            }
        }
    });
}

// 모든 상위 체크박스에 이벤트 리스너를 추가
document.querySelectorAll('.parent-checkbox').forEach(function(parentCheckbox) {
    parentCheckbox.addEventListener('change', function() {
        var childList = parentCheckbox.nextElementSibling.nextElementSibling;
        if (childList) {
            var childCheckboxes = childList.querySelectorAll('input[type="checkbox"]');
            if (parentCheckbox.checked) {
                childCheckboxes.forEach(function(childCheckbox) {
                    childCheckbox.checked = true;
                    childCheckbox.dispatchEvent(new Event('change'));
                });
            } else {
                childCheckboxes.forEach(function(childCheckbox) {
                    childCheckbox.checked = false;
                    childCheckbox.dispatchEvent(new Event('change'));
                });
            }
        }
        updateParentCheckboxes();
    });
});

// 1_TMY_78 및 3_TMY_22의 상위 체크박스에 대한 이벤트 리스너 추가
document.querySelectorAll('#1_TMY_78, #3_TMY_22').forEach(function(subCheckbox) {
    subCheckbox.addEventListener('change', function() {
        var childList = subCheckbox.nextElementSibling.nextElementSibling;
        if (childList) {
            var childCheckboxes = childList.querySelectorAll('input[type="checkbox"]');
            if (subCheckbox.checked) {
                childCheckboxes.forEach(function(childCheckbox) {
                    childCheckbox.checked = true;
                    childCheckbox.dispatchEvent(new Event('change'));
                });
            } else {
                childCheckboxes.forEach(function(childCheckbox) {
                    childCheckbox.checked = false;
                    childCheckbox.dispatchEvent(new Event('change'));
                });
            }
        }
        updateParentCheckboxes();
    });
});

// 모든 토글 버튼에 이벤트 리스너를 추가
document.querySelectorAll('.toggle-button').forEach(function(toggleButton) {
    toggleButton.addEventListener('click', function() {
        var childList = toggleButton.parentElement.querySelector('.child-list');
        if (childList.style.display === 'none' || childList.style.display === '') {
            childList.style.display = 'block';
            toggleButton.innerHTML = '▼';
        } else {
            childList.style.display = 'none';
            toggleButton.innerHTML = '▶';
        }
    });
});

// 초기화 함수
function initializeCheckboxes() {
    updateParentCheckboxes(); // 상위 체크박스 상태 업데이트
}

// 초기화 함수 호출
initializeCheckboxes();
