import json
from collections import defaultdict

JSONS_TO_MERGE = [
    "explainer_list.json",
    "stats.json",
    "corrected_stats.json",
    "depicted_idioms.json",
    "depicted_idioms_2.json",
    "depicted_meaning.json",
]
MERGE_KEY = "text"
OUTFILE = "idioms.json"

files = {}
for file in JSONS_TO_MERGE:
    print(f"Reading {file}...")
    with open(file) as f:
        data = json.load(f)
        files[file] = sorted(data, key=lambda x: x[MERGE_KEY])

if len({len(data) for data in files.values()}) > 1:
    print("Warning: JSON files have different lengths, merging will not be perfect.")
    print("Lengths:", {file: len(data) for file, data in files.items()})
    exit(1)

result = defaultdict(dict)
for file, data in files.items():
    print(f"Processing {file}...")
    for item in data:
        result[item[MERGE_KEY]].update(item)

with open(OUTFILE, "w", encoding="utf-8") as f:
    json.dump(result, f, indent=4, ensure_ascii=False)
