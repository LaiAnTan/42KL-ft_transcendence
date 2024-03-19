#!/bin/bash

response=$(curl -s "http://localhost:8000/api/tournamentAllRooms")
echo "$response"

keys=$(echo "$response" | jq -r '.tourney | keys[]')

for key in $keys; do
    value1=$(echo "$response" | jq -r ".tourney[\"$key\"][0]")
    value2=$(echo "$response" | jq -r ".tourney[\"$key\"][1]")
	echo '------------------------'
    echo "key:$key  v1:$value1  v2:$value2"
	echo '------------------------'
    
    # Make the POST request
    curl -s -X POST "http://localhost:8000/api/tournamentLoser?clientID=$value2&matchID=$key"
	echo
done
