FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN apt-get update && apt-get install -y wget \
    # && wget https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh \
    && chmod +x wait-for-it.sh init.sh \
    && apt-get remove -y wget \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# CMD using wait-for-it to wait for PostgreSQL before starting Django

CMD ["./wait-for-it.sh", "postgres:5432", "--", "/bin/bash", "init.sh"]
