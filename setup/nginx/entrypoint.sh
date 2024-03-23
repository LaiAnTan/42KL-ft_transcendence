#!/bin/bash

# Path to SSL/TLS certificate and key
CERT_DIR="/etc/nginx/certs/"
CERT_FILE="cert.pem"
KEY_FILE="key.pem"

# Ensure the directory exists
mkdir -p "$CERT_DIR"

# Check if certificate and key exist
if [ ! -f "$CERT_DIR$CERT_FILE" ] || [ ! -f "$CERT_DIR$KEY_FILE" ]; then
    # Generate SSL/TLS certificates
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout "$CERT_DIR$KEY_FILE" -out "$CERT_DIR$CERT_FILE" -subj "/C=$CERT_COUNTRY/ST=$CERT_STATE/L=$CERT_LOCATION/O=$CERT_ORG/OU=$CERT_ORG_UNIT/CN=$CERT_COMMON_NAME"
fi

# Start nginx
exec nginx -g 'daemon off;'
