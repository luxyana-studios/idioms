import json

from dotenv import load_dotenv
from pydantic import BaseModel, Field
from pydantic_ai import Agent

MODEL = "openai:gpt-4o-mini"

load_dotenv()

# DEPICTION_FILENAME = "depicted_idioms_chunk"
# DEPICTION_PROMPT = (
#     "You are an expert in smileys and their semantic meaning and interpretation. "
#     "You are an expert in translating phrases in natural language to smileys. "
#     "You use all available smileys, also those depicting signs and numbers. "
#     "You make the translation as literal and textual and evident as possible so that "
#     "the phrase is easily guessable from the depiction. "
#     "I'm going to give you a list of idioms as a bulleted list. "
#     "Give me back the same list but with each idiom translated to a list of smileys that depict the idiom's literal text. "
# )
#
DEPICTION_FILENAME = "depicted_meaning_chunk"
DEPICTION_PROMPT = (
    "You are an expert in smileys and their semantic meaning and interpretation. "
    "You are an expert in translating phrases in natural language to smileys. "
    "You use all available smileys, also those depicting signs and numbers. "
    "You capture the essence of the meaning and the emotion of a phrase and put it into a clearly understandable list of emojis. "
    "I'm going to give you a list of idioms as a bulleted list. "
    "Give me back the same list but with each idiom translated to a list of smileys that depict the idiom's literal text. "
)


class IdiomDepiction(BaseModel):
    text: str = Field(description="The idiom as text")
    depiction: list[str] = Field(
        description="A sorted list of smileys depicting the idiom"
    )


agent = Agent(
    MODEL,
    result_type=list[IdiomDepiction],
    system_prompt=DEPICTION_PROMPT,
)

with open("miner_list.json") as f:
    idioms = json.load(f)

chunk_size = 20
separator = "\n- "
for chunk in range(10):
    results = []
    batch = idioms[chunk * chunk_size : (chunk + 1) * chunk_size]
    depicted_idioms = agent.run_sync(
        f"Here is the list of idioms: {separator.join([x['text'] for x in batch])}."
    )
    print(depicted_idioms)
    results.extend(depicted_idioms.data)

    with open(f"{DEPICTION_FILENAME}_{chunk}.json", "w", encoding="utf-8") as f:
        json.dump(
            [x.model_dump() for x in results],
            f,
            indent=4,
            ensure_ascii=False,
        )
