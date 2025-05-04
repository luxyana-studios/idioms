import json

result = []
for i in range(0, 9):
    with open(f"explainer_list_chunk_{i}.json") as f:
        file = json.load(f)
        result.extend(file)

with open("explainer_list.json", "w", encoding="utf-8") as f:
    json.dump(
        result,
        f,
        indent=4,
        ensure_ascii=False,
    )
