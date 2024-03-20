FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN apk add --no-cache openssl

COPY ./https/ssl.sh ./
RUN chmod +x ./ssl.sh

RUN npm install -g http-server

EXPOSE 8080

CMD ["sh", "./https/ssl.sh"]
