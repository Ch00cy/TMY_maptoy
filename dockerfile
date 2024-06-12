FROM python:3.9.16-alpine

WORKDIR /tmy

COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 4321

CMD [ "uvicorn", "app.main:app", "--reload", "--host=0.0.0.0", "--port=4321" ]