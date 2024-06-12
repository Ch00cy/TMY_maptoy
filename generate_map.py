import os
from app.utils.folium import create_map

# HTML 파일 저장 경로
map_html_path = 'app/templates/korea-map.html'

# 디렉터리 생성 (없으면 생성)
os.makedirs(os.path.dirname(map_html_path), exist_ok=True)

# 파일이 이미 있으면 삭제
if os.path.exists(map_html_path):
    os.remove(map_html_path)

# HTML 파일로 저장
with open(map_html_path, 'w', encoding='utf-8') as f:
    f.write(create_map())   # folium_map -> create_map() 지도 생성 -> korea-map.html에 지도 저장

print("NewGenerateMap")
