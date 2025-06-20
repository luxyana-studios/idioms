# Posts the idioms.json file to the API
if [[ "$1" == "--dry-run" ]]; then
  jq -c 'to_entries[] | .value' idioms.json | while read -r payload; do
    echo "Dry run: $payload"
  done
else
  # jq -c 'to_entries[] | .value' idioms.json | xargs -I {} curl -X POST -H "Content-Type: application/json" -d '{}' localhost:8000/idioms
  jq -c 'to_entries[] | .value' idioms.json | while read -r line; do
    echo "$line" | curl -X POST -H "Content-Type: application/json" -d @- localhost:8000/idioms
  done
fi
