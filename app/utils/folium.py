import folium
import csv

def create_map():
    center_coords = [36.5, 127.5]   # 지도 중심 좌표

    # 마커 CSV 파일 경로
    csv_file_path = 'data\markers.csv'

    # CSV 파일 읽기
    markers = {}
    with open(csv_file_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            # 각 행의 이름과 위도, 경도 정보를 딕셔너리에 저장
            markers[row['name']] = [float(row['latitude']), float(row['longitude'])]

    # Folium 지도 객체 생성
    m = folium.Map(location=center_coords, zoom_start=7, tiles=None)

    # 사용자 정의 타일 레이어 추가
    folium.TileLayer(
        # tiles='http://localhost:8080/osm/{z}/{x}/{y}.png',  # 타일 URL 설정 (오프라인 타일 서버)
        tiles='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attr='Local OSM',   # 타일 속성 설정
        name='OpenStreetMap'    # 레이어 이름 설정
    ).add_to(m)

    # 마커 추가
    for name, coords in markers.items():
        folium.Marker(
            location=coords,    # 마커 위치 설정
            popup=name,         # 팝업에 마커 이름 표시
            icon=folium.Icon(color='blue')  # 마커 아이콘 색상 설정
        ).add_to(m)

    # Folium 지도 객체를 HTML 문자열로 변환하여 반환
    return m._repr_html_()

