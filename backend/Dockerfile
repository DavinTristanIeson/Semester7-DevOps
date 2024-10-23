FROM python:3.10-bullseye

WORKDIR /var/www/html

COPY ./backend .

COPY ./frontend/out ./views

RUN pip install -r requirements.lock

CMD ["fastapi", "run"]

EXPOSE 8000
