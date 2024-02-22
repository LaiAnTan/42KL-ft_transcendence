FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN apt-get update && apt-get install -y wget \
    && chmod +x wait-for-it.sh init.sh \
    && apt-get remove -y wget \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

CMD ["./wait-for-it.sh", "postgres:5432", "--", "gunicorn", "backend.wsgi:application", "-b", "0.0.0.0:8000"]
