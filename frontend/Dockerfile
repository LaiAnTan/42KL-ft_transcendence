FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g http-server

EXPOSE 8080

CMD ["npm", "start"]
