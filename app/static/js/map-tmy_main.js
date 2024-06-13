function addMarkers(folder, siteFile) {
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
                    var checklist = document.getElementById(folder + '_list');

                    markersData.forEach(function(markerData, index) {
                        var lat = parseFloat(markerData.latitude);
                        var lng = parseFloat(markerData.longitude);
                        var code = markerData.code;
                        var fullCode = folder + '_' + code;

                        var marker = L.marker([lat, lng], { icon: icons[folder] }).addTo(map);
                        marker.bindPopup(code);
                        markers[fullCode] = marker;

                        var listItem = document.createElement('li');
                        var checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.id = folder + '_' + index;
                        checkbox.value = code;
                        checkbox.className = 'marker-checkbox';
                        var label = document.createElement('label');
                        label.htmlFor = folder + '_' + index;
                        label.appendChild(document.createTextNode(code));

                        listItem.appendChild(checkbox);
                        listItem.appendChild(label);
                        checklist.appendChild(listItem);

                        checkbox.addEventListener('change', function(e) {
                            updateSelectedMarkers(e.target.checked, fullCode, marker);
                            updateParentCheckboxes();
                        });

                        marker.on('click', function() {
                            var checkbox = document.getElementById(folder + '_' + index);
                            checkbox.checked = !checkbox.checked;
                            updateSelectedMarkers(checkbox.checked, fullCode, marker);
                            updateParentCheckboxes();
                        });
                    });
                }
            });
        })
        .catch(error => console.error('Error fetching the CSV file:', error));
}

// Add markers for each folder
addMarkers('2021_100', '/static/data/data_TMY/2021_100/1_TMY_78/1_site_info.csv');
addMarkers('2021_100', '/static/data/data_TMY/2021_100/3_TMY_22/3_site_info.csv');
addMarkers('2022_200', '/static/data/data_TMY/2022_200/site_info.csv');
addMarkers('2023_700', '/static/data/data_TMY/2023_700/site_info.csv');
