import os
import csv
from pathlib import Path

# markers.csv 파일 경로
markers_csv_path = Path("app/static/data/markers/markers.csv")

# 저장할 디렉토리 경로
files_dir = Path("app/static/data/files")
files_dir.mkdir(parents=True, exist_ok=True)

# markers.csv 파일을 읽고 각 마커에 대해 개별 CSV 파일 생성
with open(markers_csv_path, mode='r', encoding='utf-8') as markers_csv:
    csv_reader = csv.DictReader(markers_csv)
    for row in csv_reader:
        name = row['name']
        latitude = row['latitude']
        longitude = row['longitude']
        file_path = files_dir / f"{name}.csv"
        
        with open(file_path, mode='w', encoding='utf-8', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['name', 'latitude', 'longitude'])
            writer.writerow([name, latitude, longitude])

print("CSV 파일 생성 완료")
