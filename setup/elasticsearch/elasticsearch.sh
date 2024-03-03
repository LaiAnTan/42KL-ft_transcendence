#!bin/sh

# extract elastic password
ELASTIC_PASSWORD=$(echo 'y' | ./bin/elasticsearch-reset-password -u elastic | grep -oP 'New value: \K.+')

echo "ELASTIC_PASSWORD=$ELASTIC_PASSWORD" >> /host/.env

# extract kibana enrollment token
KIBANA_ENROLLMENT_TOKEN=$(./usr/share/elasticsearch/bin/elasticsearch-create-enrollment-token -s kibana | head -n 3 | tail -n 1)

echo "KIBANA_ENROLLMENT_TOKEN=$KIBANA_ENROLLMENT_TOKEN" >> /host/.env

