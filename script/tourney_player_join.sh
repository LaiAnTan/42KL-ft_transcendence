#!/bin/bash



base_url="http://localhost:8000/api/tournamentInit"
client_ids=("test1" "test2" "test3" "test4" "test5" "test6" "test7" "test8" "test9")

for client_id in "${client_ids[@]}"; do
    url="$base_url?clientID=$client_id"
    response=$(curl -s "$url")

    if [[ $? -eq 0 ]]; then
        echo "GET request successful for client ID $client_id:"
        echo "$response"  # Adjust this line based on your response format
        echo "------------------------"
    else
        echo "Failed to get data for client ID $client_id."
    fi
done
