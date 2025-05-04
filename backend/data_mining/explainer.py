import json

from dotenv import load_dotenv
from pydantic import BaseModel, Field
from pydantic_ai import Agent

MODEL = "openai:gpt-4o-mini"

load_dotenv()


class ExpandedIdiom(BaseModel):
    text: str = Field(description="The idiom as text")
    meaning: str = Field(description="The meaning of the idiom")
    explanation: str = Field(description="Explanation of the idiom")
    examples: list[str] = Field(description="Examples of the idiom")


agent = Agent(
    MODEL,
    result_type=ExpandedIdiom,
    system_prompt="You are an idiom search engine. "
    "You are an expert in idioms, can explain their meanings, and give examples. "
    "You can also explain the origin or logic behind the idioms."
    "I'm going to give you an idiom. "
    "Give me back: the idioms text, its meaning, and a short explanation regarding its origin or the logic behind it. "
    "Also provide three short, simple, funny examples capturing the idea of the idiom.",
)

with open("miner_list.json") as f:
    idioms = json.load(f)

for chunk in range(2, 10):
    chunk_size = 20
    results = []
    for idiom in idioms[chunk * chunk_size : (chunk + 1) * chunk_size]:
        expanded_idiom = agent.run_sync(f"Here is the idiom: '{idiom['text']}'.")
        results.append(expanded_idiom.data)

    print(results)

    with open(f"explainer_list_chunk_{chunk}.json", "w", encoding="utf-8") as f:
        json.dump(
            [x.model_dump() for x in results],
            f,
            indent=4,
            ensure_ascii=False,
        )
