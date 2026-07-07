#!/bin/bash
python3 manage.py collectstatic --noinput
python3 manage.py migrate --noinput
gunicorn davidouma_portfolio.wsgi:application --bind 0.0.0.0:$PORT
