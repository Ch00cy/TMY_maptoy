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

// '다운로드 in zip' 버튼 클릭 이벤트 핸들러
document.getElementById('downloadButton3').addEventListener('click', function() {
    var zip = new JSZip();  // JSZip 객체 생성 - ZIP 파일을 생성하는 라이브러리 사용

    // 선택된 마커에 대해 데이터를 가져오는 fetch 요청 생성
    var fetchPromises = selectedMarkers.map(function(fullCode) {
        var parts = fullCode.split('+');    // fullCode를 '+'로 분할하여 폴더와 마커 이름을 추출
        var filePath, folder, subfolder, code;

        if (parts.length === 3) {
            // 폴더, 하위폴더, 코드로 구성된 경우
            [folder, subfolder, code] = parts;
            filePath = `/static/data/data_TMY/${folder}/${subfolder}/data/${code}.csv`; // 파일 경로 설정
        } else {
            // 폴더, 코드로 구성된 경우
            [folder, code] = parts;
            filePath = `/static/data/data_TMY/${folder}/data/${code}.csv`;  // 파일 경로 설정
        }

        // 파일을 가져오는 fetch 요청
        return fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok'); // 네트워크 응답이 성공적이지 않은 경우 오류 발생
                }
                return response.blob();  // 응답을 Blob 형식으로 변환
            })
            .then(blob => {
                // 폴더, 하위폴더 구조에 따라 파일 추가
                if (parts.length === 3) {
                    var folderPath = zip.folder(folder).folder(subfolder);  // 폴더 및 하위폴더 생성
                    folderPath.file(`${code}.csv`, blob); // 해당 하위 폴더에 파일 추가
                } else {
                    var folderPath = zip.folder(folder);    // 폴더 생성
                    folderPath.file(`${code}.csv`, blob); // 해당 폴더에 파일 추가
                }
            })
            .catch(error => console.error('Error fetching file:', error));  // 파일 가져오기 실패 시 오류 출력
    });

    // 모든 fetch 요청이 완료되면 -> ZIP 파일 생성 -> 다운로드
    Promise.all(fetchPromises).then(() => {
        zip.generateAsync({ type: 'blob' }).then(function(content) {    // 'zip' 에 추가된 모든 파일,폴더를 ZIP 파일 비동기적 생성
                                                                        // content : 생성된 ZIP 파일의 Bolb 객체
            saveAs(content, 'result.zip');  // 생성된 zip 파일 다운로드
        });
    });
});
