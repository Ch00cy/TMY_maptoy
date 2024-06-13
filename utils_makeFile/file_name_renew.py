import os
import pandas as pd

# 폴더 및 파일 설정 (윈도우 경로 수정)
data_folder = 'data_TMY/2022_200/data'  # 또는 'data_TMY\\2022_200\\data'
new_folder = os.path.join(data_folder, 'new3')

# 새로운 폴더 생성
os.makedirs(new_folder, exist_ok=True)

# data 폴더 내 모든 파일에 대해 반복
for filename in os.listdir(data_folder):
    if filename.endswith('.csv'):
        # 파일 이름을 _로 분리
        name_parts = filename.split('_')
        if len(name_parts) > 2:  # 이름에 세 번째 파트가 존재하는지 확인
            new_filename = name_parts[2] + '.csv'
            
            # 원본 파일 경로와 새 파일 경로 설정
            original_file_path = os.path.join(data_folder, filename)
            new_file_path = os.path.join(new_folder, new_filename)
            
            try:
                # CSV 파일 읽고 새 경로에 저장
                df = pd.read_csv(original_file_path, encoding='cp949')  # 인코딩 지정
                df.to_csv(new_file_path, index=False, encoding='cp949')  # cp949 로 저장
            except UnicodeDecodeError as e:
                print(f"Error reading {filename}: {e}")

print("작업이 완료되었습니다.")
