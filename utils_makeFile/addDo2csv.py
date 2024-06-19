import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# GeoJSON 파일을 로드합니다.
gdf = gpd.read_file('app/static/data/do/Do.geojson')

# 도를 찾는 함수 정의
def find_do(lat, lon):
    point = Point(lon, lat)
    for index, row in gdf.iterrows():
        if point.within(row['geometry']):
            return row['sidonm']
    return "Unknown"

# CSV 파일을 처리하는 함수 정의
def process_csv(file_path):
    try:
        df = pd.read_csv(file_path, encoding='euc-kr')  # 인코딩을 euc-kr로 지정
    except UnicodeDecodeError:
        df = pd.read_csv(file_path, encoding='utf-8')  # 인코딩을 utf-8로 시도
    # sidonm 열 추가
    df['sidonm'] = df.apply(lambda row: find_do(row['latitude'], row['longitude']), axis=1)
    # CSV 파일 저장
    df.to_csv(file_path, index=False, encoding='utf-8-sig')  # 저장할 때 인코딩을 utf-8-sig로 지정
    print(f"Processed {file_path}")

# CSV 파일 목록
csv_files = [
    'app/static/data/data_TMY/2021_100/1_TMY_78/1_site_info.csv',
    'app/static/data/data_TMY/2021_100/3_TMY_22/3_site_info.csv',
    'app/static/data/data_TMY/2022_200/site_info.csv',
    'app/static/data/data_TMY/2023_700/1_TMY_measure_6/site_info.csv',
    'app/static/data/data_TMY/2023_700/2_TMY_measure_48/site_info.csv',
    'app/static/data/data_TMY/2023_700/3_TMY_model_78/site_info.csv'
]

# 각 CSV 파일 처리
for file_path in csv_files:
    process_csv(file_path)
