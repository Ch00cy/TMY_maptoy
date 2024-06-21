// 클라이언트 측 : 파일 다운로드 + 다운로드 count 

// 다운로드 카운트를 업데이트하는 함수
function updateDownloadCount(markerName) {
    // markerName : URL 인코딩하여 서버로 전송할 수 있게 변경
    const encodedMarkerName = encodeURIComponent(markerName);  
    // 해당 경로로 POST 요청 -> FastAPI 서버의 download_file() 호출 
    // -> 1. 다운로드 count 2. 파일 반환
    fetch(`/download/${encodedMarkerName}`, {   
        method: 'POST'  // POST 요청
    }).catch(error => console.error('다운로드 카운트 업데이트 중 오류 발생:', error));
}

// '다운로드 in zip' 버튼 클릭 이벤트 핸들러
document.getElementById('downloadButton3').addEventListener('click', function() {
    var zip = new JSZip();  // JSZip 객체 생성 - ZIP 파일을 생성하는 라이브러리 사용

    // 선택된 마커에 대해 데이터를 가져오는 fetch 요청 생성
    var fetchPromises = selectedMarkers.map(function(fullCode) {
        var parts = fullCode.split('+');    // fullCode를 '+'로 분할하여 폴더와 마커 이름을 추출
        var folder, subfolder, code;

        if (parts.length === 3) {
            // 폴더, 하위폴더, 코드로 구성된 경우
            [folder, subfolder, code] = parts;
            if (folder === "2023_700" && subfolder === "2_TMY_measure_48") {
                // 예외 처리: 2023_700/2_TMY_measure_48의 경우
                return fetchSpecialFiles(folder, subfolder, code, zip).then(() => {
                    updateDownloadCount(fullCode);
                });
            } else {
                var filePath = `/static/data/data_TMY/${folder}/${subfolder}/data/${code}.csv`;
                return fetchAndAddToFile(filePath, zip, folder, subfolder, code).then(() => {
                    updateDownloadCount(fullCode);
                });
            }
        } else {
            // 폴더, 코드로 구성된 경우
            [folder, code] = parts;
            var filePath = `/static/data/data_TMY/${folder}/data/${code}.csv`;
            return fetchAndAddToFile(filePath, zip, folder, null, code).then(() => {
                updateDownloadCount(fullCode);
            });
        }
    });

    // 모든 fetch 요청이 완료되면 -> ZIP 파일 생성 -> 다운로드
    Promise.all(fetchPromises).then(() => {
        zip.generateAsync({ type: 'blob' }).then(function(content) {    // 'zip' 에 추가된 모든 파일,폴더를 ZIP 파일 비동기적 생성
            saveAs(content, 'result.zip');  // 생성된 zip 파일 다운로드
        });
    });
});

// 파일을 가져와서 zip에 추가하는 함수
function fetchAndAddToFile(filePath, zip, folder, subfolder, code) {
    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok'); // 네트워크 응답이 성공적이지 않은 경우 오류 발생
            }
            return response.blob();  // 응답을 Blob 형식으로 변환
        })
        .then(blob => {
            var folderPath = zip.folder(folder);
            if (subfolder) {
                folderPath = folderPath.folder(subfolder);  // 하위 폴더 생성
            }
            folderPath.file(`${code}.csv`, blob); // 해당 폴더에 파일 추가
        })
        .catch(error => console.error('Error fetching file:', error));  // 파일 가져오기 실패 시 오류 출력
}

// 예외 처리 함수: 2023_700/2_TMY_measure_48의 경우
function fetchSpecialFiles(folder, subfolder, code, zip) {
    var basePath = `/static/data/data_TMY/${folder}/${subfolder}/data/`;
    var specialFiles = [`1991_${code}.csv`, `2001_${code}.csv`, `2011_${code}.csv`];
    var specialFetchPromises = specialFiles.map(file => {
        var specialFilePath = basePath + file;
        return fetch(specialFilePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                var folderPath = zip.folder(folder).folder(subfolder);
                folderPath.file(file, blob);
            })
            .catch(error => console.error('Error fetching special file:', error));
    });

    return Promise.all(specialFetchPromises);   //  모든 작업이 완료될 때 까지 기다림
}
