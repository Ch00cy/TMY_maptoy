// // '다운로드 all files' 버튼 클릭 이벤트 핸들러
// document.getElementById('downloadButton1').addEventListener('click', function() {
//     // 선택된 마커에 대해 각각 파일을 다운로드
//     selectedMarkers.forEach(function(fullCode) {
//         // fullCode를 '+'로 분할하여 폴더와 마커 이름을 추출
//         var parts = fullCode.split('+');
//         var filePath;

//         if (parts.length === 3) {
//             var [folder, subfolder, code] = parts;
//             filePath = `/static/data/data_TMY/${folder}/${subfolder}/data/${code}.csv`;
//         } else {
//             var [folder, code] = parts;
//             filePath = `/static/data/data_TMY/${folder}/data/${code}.csv`;
//         }

//         // 다운로드 링크 생성
//         var link = document.createElement('a');
//         link.href = filePath;
//         link.download = `${code}.csv`;
//         // 링크를 클릭하여 파일 다운로드
//         link.click();
//     });
// });

// // '다운로드 in one file' 버튼 클릭 이벤트 핸들러
// document.getElementById('downloadButton2').addEventListener('click', function() {
//     var allData = []; // 모든 데이터를 저장할 배열

//     // 선택된 마커에 대해 데이터를 가져오는 fetch 요청 생성
//     var fetchPromises = selectedMarkers.map(function(fullCode) {
//         var parts = fullCode.split('+');
//         var filePath;

//         if (parts.length === 3) {
//             var [folder, subfolder, code] = parts;
//             filePath = `/static/data/data_TMY/${folder}/${subfolder}/data/${code}.csv`;
//         } else {
//             var [folder, code] = parts;
//             filePath = `/static/data/data_TMY/${folder}/data/${code}.csv`;
//         }

//         return fetch(filePath)
//             .then(response => response.text()) // 응답을 텍스트로 변환
//             .then(data => {
//                 var parsedData = Papa.parse(data, { header: true }).data; // CSV 데이터 파싱
//                 allData = allData.concat(parsedData); // 모든 데이터를 합침
//             });
//     });

//     // 모든 fetch 요청이 완료되면 데이터를 하나의 CSV로 병합하여 다운로드
//     Promise.all(fetchPromises).then(() => {
//         var csv = Papa.unparse(allData); // 데이터를 CSV 형식으로 변환
//         var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); // Blob 객체 생성
//         var link = document.createElement('a');
//         link.href = URL.createObjectURL(blob);
//         link.download = 'combined_markers.csv';
//         link.click(); // 링크를 클릭하여 파일 다운로드
//     });
// });

document.getElementById('downloadButton3').addEventListener('click', function() {
    var zip = new JSZip();

    var fetchPromises = selectedMarkers.map(function(fullCode) {
        var parts = fullCode.split('+');
        var filePath, folder, subfolder, code;

        if (parts.length === 3) {
            [folder, subfolder, code] = parts;
            filePath = `/static/data/data_TMY/${folder}/${subfolder}/data/${code}.csv`;
        } else {
            [folder, code] = parts;
            filePath = `/static/data/data_TMY/${folder}/data/${code}.csv`;
        }

        return fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();  // 응답을 Blob 형식으로 변환
            })
            .then(blob => {
                if (parts.length === 3) {
                    var folderPath = zip.folder(folder).folder(subfolder);
                    folderPath.file(`${code}.csv`, blob); // 해당 하위 폴더에 파일 추가
                } else {
                    var folderPath = zip.folder(folder);
                    folderPath.file(`${code}.csv`, blob); // 해당 폴더에 파일 추가
                }
            })
            .catch(error => console.error('Error fetching file:', error));
    });

    // 모든 fetch 요청이 완료되면 -> ZIP 파일 생성 -> 다운로드
    Promise.all(fetchPromises).then(() => {
        zip.generateAsync({ type: 'blob' }).then(function(content) {
            saveAs(content, 'result.zip');  // zip 파일 다운로드
        });
    });
});
