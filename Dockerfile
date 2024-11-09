FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --legacy-peer-deps 

COPY . .

COPY .env.dev .env.test .env.prod ./

RUN npm run migrate:dev

RUN npm run migrate:test

EXPOSE 3000

CMD ["npm","run","start:dev"]