from sqlalchemy import Column, Integer, String, TIMESTAMP, Float, func
# 베이스 클래스를 생성하는 함수. 이 클래스를 통해 데이터베이스 테이블 모델을 정의
from sqlalchemy.ext.declarative import declarative_base 

# SQLAlchemy 에서 "테이블 모델을 정의할 때 사용하는 클래스" 생성 하는 기반 클래스
# SQLAlchemy ORM을 사용할 때 -> 데이터베이스 테이블 모델을 정의할 때 기반이 되는 클래스를 생성
# 모든 테이블 모델 클래스는 이 베이스 클래스를 상속받아야 함.
Base = declarative_base()

class DownloadCount(Base):
    __tablename__ = 'download_count'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    marker_name = Column(String(255), nullable=False)
    download_count = Column(Integer, default=0)
    last_download = Column(TIMESTAMP, default=func.current_timestamp())
    
# class DownloadCount(Base):
#     __tablename__ = 'maria_download_count'
    
#     id = Column(Integer, primary_key=True, autoincrement=True)
#     marker_name = Column(String(255), nullable=False)
#     download_count = Column(Integer, server_default="0")
#     last_download = Column(TIMESTAMP, server_default=func.current_timestamp())

