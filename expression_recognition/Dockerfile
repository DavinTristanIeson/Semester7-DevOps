FROM python:3.10-bullseye

WORKDIR /var/www/html

COPY ./expression_recognition .

RUN python scripts/download-models.py

RUN pip install -r requirements.lock

CMD ["fastapi", "run"]

EXPOSE 8000
