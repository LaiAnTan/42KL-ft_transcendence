#!/bin/bash

CERT_FILE="cert.pem"
KEY_FILE="key.pem"

CERT_DIR="/etc/certs"

# Check if certificate and key exist
if [ ! -f "$CERT_DIR/$CERT_FILE" ] || [ ! -f "$CERT_DIR/$KEY_FILE" ]; then
    # Generate SSL/TLS certificates
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout "$CERT_DIR/$KEY_FILE" -out "$CERT_DIR/$CERT_FILE" -addext "subjectAltName=DNS:$CERT_COMMON_NAME" -subj "/C=$CERT_COUNTRY/ST=$CERT_STATE/L=$CERT_LOCATION/O=$CERT_ORG/OU=$CERT_ORG_UNIT/CN=$CERT_COMMON_NAME"
fi

exec "$@"