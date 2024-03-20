#!/bin/sh

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout key.pem -out cert.pem -subj "/C=MY/ST=Selangor/L=Sunway/O=42 Malaysia/OU=Student/CN=Ding-Dong"

npm start