#!/bin/bash

# script for setting up database

python manage.py makemigrations base

python manage.py migrate base

echo "Done"