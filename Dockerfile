FROM node:22

WORKDIR /app

COPY *.json /app

RUN npm install

COPY . .

EXPOSE 3000
