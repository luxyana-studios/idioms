import json

from dotenv import load_dotenv
from pydantic import BaseModel, Field
from pydantic_ai import Agent

MODEL = "openai:gpt-4o-mini"

load_dotenv()

STATS_FILENAME = "corrected_stats_chunk_"
STATS_PROMPT = (
    "You are an idiom analysis engine. "
    "You are an expert in idioms and their idiomatic usage. "
    "You have an excellent understanding of idioms and can intuitively assess their attributes. "
    "For each idiom provided, you will quickly analyze and return detailed statistics based on the following attributes:"
    "- Context Diversity: List different contexts/fields (e.g., business, sports, daily life, education, entertainment) where the idiom is used. "
    "Provide the analysis for each idiom in a structured format. "
    "I'm going to give you a list of idioms as a bulleted list. "
    "Give me back the same list but with each idiom analyzed according to the attributes above. "
    "You are quick and efficient, you keep your answers concise and to the point, you prioritize speed over accuracy, "
    "you do not need to provide explanations or justifications for your ratings. "
)


class IdiomAttributes(BaseModel):
    text: str = Field(description="The idiom as text")
    context_diversity: list[str] = Field(
        description="Different contexts/fields (e.g., business, sports, daily life, education, entertainment) where the idiom is used. This is not an exhaustive list."
    )


agent = Agent(
    MODEL,
    result_type=list[IdiomAttributes],
    system_prompt=STATS_PROMPT,
)

with open("miner_list.json") as f:
    idioms = json.load(f)

chunk_size = 20
separator = "\n- "
for chunk in range(10):
    results = []
    batch = idioms[chunk * chunk_size : (chunk + 1) * chunk_size]
    idiom_stats = agent.run_sync(
        f"Here is the list of idioms: {separator.join([x['text'] for x in batch])}."
    )
    print(idiom_stats)
    results.extend(idiom_stats.data)

    with open(f"{STATS_FILENAME}_{chunk}.json", "w", encoding="utf-8") as f:
        json.dump(
            [x.model_dump() for x in results],
            f,
            indent=4,
            ensure_ascii=False,
        )
