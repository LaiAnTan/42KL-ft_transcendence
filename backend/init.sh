#!/bin/bash

# script for setting up database

python manage.py makemigrations base

python manage.py migrate base

python manage.py migrate auth

python manage.py runserver 0.0.0.0:8000

echo "Done"