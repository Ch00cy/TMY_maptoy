# TMY_mapAPI_test

TMY project
This is toy project to test mapAPI in offline (local) environment.
--UXF

uvicorn app.main:app --reload --host=0.0.0.0 --port=4321
http://192.168.0.199:4321/


pip freeze > requirements.txt
pip install -r requirements.txt
pip list --format=freeze > requirements.txt

sudo docker run -p 8080:80 -v osm-data:/data/database -d overv/openstreetmap-tile-server run
docker run -p 8080:80 -v osm-data:/data/database -d overv/openstreetmap-tile-server run
http://192.168.0.199:8080/tile/0/0/0.png
http://192.168.0.199:8080


sudo docker ps -a
sudo docker stop 컨테이너id

docker-compose up --build

1.	Ubuntu
A.	docker pull ubuntu:22.04
B.	docker run --name ubuntn_c -d ubuntu:22.04
C.	우분투 백그라운드에서 실행
2.	Osm tile map
A.	Osm.pdf 데이터 준비
B.	docker volume create osm-data
C.	docker run  -v C:\UXF\tmy_toy\app\static\data\maptile\south-korea-latest.osm.pbf:/data/region.osm.pbf  -v osm-data:/data/database/  overv/openstreetmap-tile-server  import
D.	docker run -p 8080:80 -v osm-data:/data/database -d overv/openstreetmap-tile-server run
3.	docker-compose 실행
A.	docker-compose up
B.	docker-compose down --rmi all -v

docker volume ls
docker volume rm osm-data

docker volume create osm-data
docker run -v $(pwd)/app/static/data/maptile/south-korea-latest.osm.pbf:/data/region.osm.pbf -v osm-data:/data/database/ overv/openstreetmap-tile-server import

컴 기준 
우분투: docker start friendly_rosalind
맵타일: docker start zen_euler
나머지: docker-compose up
docker-compose down --rmi all -v