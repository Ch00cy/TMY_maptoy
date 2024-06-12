from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from fastapi.responses import HTMLResponse


app = FastAPI() # FastAPI 객체 생성 -> 애플리케이션 인스턴스 


app.mount("/static", StaticFiles(directory="app/static"), name="static")    # 정적 파일 제공 디렉토리
templates = Jinja2Templates(directory="app/templates")  # 템플릿 디렉토리 -> 디렉토리 내 파일 사용 가능

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
