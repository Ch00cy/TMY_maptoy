import os   # 파일 경로 확인
from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.staticfiles import StaticFiles # StaticFiles 클래스 -> 정적인 파일 제공 (JavaScript, CSS, 이미지)
# Jinja2Templates 클래스 -> Jinja2 템플릿 엔진 사용 
# Jinja2 : 파이썬용 템플릿 엔진 , HTML 등 텍스트 파일 동적으로 생성 , 템플릿 디렉토리 설정 + 렌더링
from fastapi.templating import Jinja2Templates  
from fastapi.responses import HTMLResponse, FileResponse
# SQLAlchemy : python - DB 상호작용 <- ORM 라이브러리 (Object Relational Mapper) 
# create_engine : SQLAlchemy에서 데이터베이스에 연결하기 위해 사용
# 1. DB 연결 2. 엔진 객체 생성 -> 쿼리 실행 위하여
# func : SQL 함수 호출 지원 모듈
from sqlalchemy import create_engine, func
# sessionmaker : 데이터베이스 세션 생성을 위한 팩토리 함수
# 세션 : DB 연결 -> SQL 쿼리 실행 -> 트랜잭션 관리
# Session : DB 세션 나타내는 클래스
from sqlalchemy.orm import sessionmaker, Session
from models import DownloadCount, Base
import urllib.parse

# MYSQL DB 연결 URL (DB 사용자 이름, 비밀번호, 호스트, 포트, DB 이름)
DATABASE_URL = 'mysql+pymysql://root:uxfac@localhost:3306/dbname' 

# SQLAlchemy 엔진 생성 (DB와 상호작용할 수 있는) -> DB 와 연결 => 객체
engine = create_engine(DATABASE_URL)
# sessionmaker : 테이터베이스 관리하는 함수 (세션 팩토리 함수)
# 세션 : 데이터베이스와의 모든 상호작용을 담당하는 객체 (DB 연결 -> SQL 쿼리 실행 -> 트랜잭션 관리)
# 팩토리 함수 : 객체 생성하여 반환하는 함수
# autocommit=False : 세션이 자동으로 커밋되지 않도록 설정 (수동으로 session.commit() 호출 -> 트랜잭션 커밋)
# 트랜잭션 : DB에서 하나의 작업 단위로 처리되는 일련의 연산
# autoflush=False : 세션이 자동으로 플러시 되지 않도록 설정 (수동으로 session.flush() -> 변경 내용 DB에 반영)
# bind=engine : 생성된 엔진 객체를 세션에서 바인딩
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# SQLAlchemy 사용하여 정의된 모든 테이블 -> 데이터베이스에 생성
# DB <-> ORM 모델 동기화 => SQLAlchemy 모델 클래스 => 실제 데이터 베이스 테이블로 변환
# models.py->Base : SQLAlchemy 에서 "테이블 모델 정의할 때 사용하는 클래스"를 생성하는 기반 클래스
# metadata : DB 테이블 + 스키마 정의 등 포함한 객체
# create_all : 메타데이터 객체에 정의된 모든 테이블을 실제 데이터베이스에 생성
# bind : DB 연결 정보를 포함하는 엔진객체 지정
Base.metadata.create_all(bind=engine)

app = FastAPI() # FastAPI 객체 생성 -> 애플리케이션 인스턴스

app.mount("/static", StaticFiles(directory="app/static"), name="static")    # 정적 파일 제공 디렉토리
templates = Jinja2Templates(directory="app/templates")  # 템플릿 디렉토리 -> 디렉토리 내 파일 사용 가능

# SQLAlchemy 세션 생성 + 요청 끝나면 세션 닫음
def get_db():
    db = SessionLocal()
    try:
        yield db    # yield (생성하다) : python generater
    finally:
        db.close()

# 루트 엔드포인트
@app.get("/")   # 데코레이터
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})   # .html 템플릿 응답으로 반환 + request 객체 템플릿에 전달

# korea-map 엔드포인트
@app.get("/korea-map", response_class=HTMLResponse)
async def korea_map(request: Request):
    return templates.TemplateResponse("korea-map.html", {"request": request})

# leaflet 엔드 포인트
@app.get("/leaflet", response_class=HTMLResponse)
async def leaflet_map(request: Request):
    return templates.TemplateResponse("leaflet.html", {"request": request})

# map-tmy 엔드 포인트
@app.get("/map-tmy", response_class=HTMLResponse)
async def map_tmy(request: Request):
    return templates.TemplateResponse("map-tmy.html", {"request": request})

# 데토레이터 : 해당 경로에대한 POST 요청 처리
# {marker_name} : 동적으로 제공되는 경로 매개변수
@app.post("/download/{marker_name}")
# async def : 비동기 함수
# marker_name: str : URL에서 추출된 문자열 매개변수
# db: Session = Depends(get_db) : get_db() 를 통해 주입된 데이터베이스 세션 객체 
# Depends() : FASTAPI 종속성 주입 베커니즘 -> 함수 매개변수에 필요한 객체 주입
async def download_file(marker_name: str, db: Session = Depends(get_db)):
    # 다운로드 카운트 업데이트
    # marker_name = DownloadCount 찾기
    # 레코드 존재하면 : count 증가 + 마지막 다운로드 시간 업데이트
    # 레코드 존재 안하면 : 새로운 레코드 생성 + DB에 추가 (값은 1로 생성)
    marker = db.query(DownloadCount).filter(DownloadCount.marker_name == marker_name).first()
    if marker:
        marker.download_count += 1
        marker.last_download = func.current_timestamp()
    else:
        marker = DownloadCount(marker_name=marker_name, download_count=1)
        db.add(marker)
    db.commit() # 변경사항 DB에 반영

    # 파일 존재 여부 확인 #####
    # URL 인코딩된 문자열을 디코딩
    decoded_marker_name = urllib.parse.unquote(marker_name)

    # 파일 경로 설정
    parts = decoded_marker_name.split('+')
    if len(parts) == 3:
        folder, subfolder, code = parts
        file_path = f"app/static/data/data_TMY/{folder}/{subfolder}/data/{code}.csv"
    elif len(parts) == 2:
        folder, code = parts
        file_path = f"app/static/data/data_TMY/{folder}/data/{code}.csv"
    else:
        raise HTTPException(status_code=400, detail="Invalid marker name format")

    # 파일 존재 여부 확인
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File {file_path} does not exist.")
    ##########

    # 파일 존재하면 FileResponse : 클라이언트에게 파일 반환
    return FileResponse(path=file_path, filename=f"{code}.csv")