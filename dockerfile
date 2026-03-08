FROM node:22.12.0-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3001