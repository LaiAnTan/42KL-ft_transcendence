#!/bin/bash

base_url="https://localhost:8000/api/tournamentLoser"
client_ids=("test1" "test3" "test6" "test8")

for client_id in "${client_ids[@]}"; do
    echo "Deleting client ID: $client_id"
    curl -X DELETE "$base_url?loserID=$client_id"

echo
echo "------------------------"
done