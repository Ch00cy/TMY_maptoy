document.getElementById('downloadButton1').addEventListener('click', function() {
    selectedMarkers.forEach(function(fullCode) {
        var [folder, markerName] = fullCode.split('_', 2);
        var link = document.createElement('a');
        link.href = `/static/data/data_TMY/${folder.replace('_', '/')}/data/${markerName}.csv`;
        link.download = `${markerName}.csv`;
        link.click();
    });
});

document.getElementById('downloadButton2').addEventListener('click', function() {
    var allData = [];
    var fetchPromises = selectedMarkers.map(function(fullCode) {
        var [folder, markerName] = fullCode.split('_', 2);
        return fetch(`/static/data/data_TMY/${folder.replace('_', '/')}/data/${markerName}.csv`)
            .then(response => response.text())
            .then(data => {
                var parsedData = Papa.parse(data, { header: true }).data;
                allData = allData.concat(parsedData);
            });
    });

    Promise.all(fetchPromises).then(() => {
        var csv = Papa.unparse(allData);
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'combined_markers.csv';
        link.click();
    });
});

document.getElementById('downloadButton3').addEventListener('click', function() {
    var zip = new JSZip();
    var folder = zip.folder("markers");

    var fetchPromises = selectedMarkers.map(function(fullCode) {
        var [folder, markerName] = fullCode.split('_', 2);
        var filePath = `/static/data/data_TMY/${folder.replace('_', '/')}/data/${markerName}.csv`;

        return fetch(filePath)
            .then(response => response.blob())
            .then(blob => {
                folder.file(`${markerName}.csv`, blob);
            });
    });

    Promise.all(fetchPromises).then(() => {
        zip.generateAsync({ type: 'blob' }).then(function(content) {
            saveAs(content, 'result.zip');
        });
    });
});
