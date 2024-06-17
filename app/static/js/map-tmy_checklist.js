function toggleChildList(id) {
    var childList = document.getElementById(id);
    if (childList.style.display === 'none' || childList.style.display === '') {
        childList.style.display = 'block';
    } else {
        childList.style.display = 'none';
    }
}

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
        marker.setIcon(marker.options.icon); // 원래 아이콘으로 복원
    }
    document.getElementById('markerNames').innerText = selectedMarkers.join(', ');
}

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

document.querySelectorAll('.parent-checkbox').forEach(function(parentCheckbox) {
    parentCheckbox.addEventListener('change', function() {
        var childList = parentCheckbox.nextElementSibling.nextElementSibling;
        if (childList) {
            var childCheckboxes = childList.querySelectorAll('input[type="checkbox"]');
            if (parentCheckbox.checked) {
                // 상위 항목이 체크되면 하위 항목들도 모두 체크
                childCheckboxes.forEach(function(childCheckbox) {
                    childCheckbox.checked = true;
                    childCheckbox.dispatchEvent(new Event('change'));
                });
            } else {
                // 상위 항목이 체크 해제되면 하위 항목들도 모두 체크 해제
                childCheckboxes.forEach(function(childCheckbox) {
                    childCheckbox.checked = false;
                    childCheckbox.dispatchEvent(new Event('change'));
                });
            }
        }
    });
});

document.querySelectorAll('.toggle-button').forEach(function(toggleButton) {
    toggleButton.addEventListener('click', function() {
        var childList = toggleButton.nextElementSibling.nextElementSibling;
        if (childList.style.display === 'none' || childList.style.display === '') {
            childList.style.display = 'block';
            toggleButton.innerHTML = '▼';
        } else {
            childList.style.display = 'none';
            toggleButton.innerHTML = '▶';
        }
    });
});
