FROM node:latest

RUN mkdir -p /srv/app
COPY /Pong /srv/app