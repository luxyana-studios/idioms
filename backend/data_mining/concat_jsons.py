import json
import pathlib

INPUT_DIR = "resources/corrected_stats"
OUTFILE = f"{INPUT_DIR}.json"

result = []
for file in pathlib.Path(INPUT_DIR).rglob("*.json"):
    print(f"Processing {file}")
    with open(file) as f:
        result.extend(json.load(f))

with open(OUTFILE, "w", encoding="utf-8") as f:
    json.dump(result, f, indent=4, ensure_ascii=False)
