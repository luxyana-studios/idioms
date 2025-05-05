import json

from dotenv import load_dotenv
from pydantic import BaseModel, Field
from pydantic_ai import Agent

MODEL = "openai:gpt-4o-mini"

load_dotenv()


class TranslatedIdiom(BaseModel):
    english_text: str = Field(description="The idiom as text")
    language: str = Field(description="The language of the idiom")
    native_text: str = Field(description="The idiom's text in this language")
    meaning: str = Field(description="The meaning of the idiom")
    explanation: str = Field(description="Explanation of the idiom")
    examples: list[str] = Field(description="Examples of the idiom")


agent = Agent(
    MODEL,
    result_type=TranslatedIdiom,
    system_prompt="You are an idiom expert translator. "
    "Given an idiom in English, you can translate it to its closes version in another language. "
    "You are an expert in idioms, can explain their meanings, and give examples. "
    "You can also explain the origin or logic behind the idioms.",
)

language = "French"


english_idioms = [
    "Break the ice",
    "Bite the bullet",
    "Hit the nail on the head",
    "Let the cat out of the bag",
    "Piece of cake",
    "Spill the beans",
    "Costs an arm and a leg",
    "Burn the midnight oil",
    "Under the weather",
    "Once in a blue moon",
]
translated_idioms = []
for english_idiom in english_idioms:
    result = agent.run_sync(
        f"Translate the idiom '{english_idiom}' to {language}. Answer in {language}."
    )
    translated_idioms.append(result.data)


print(translated_idioms)

with open(f"languages/{language.lower()}.json", "w") as f:
    json.dump(
        [x.model_dump() for x in translated_idioms],
        f,
        indent=4,
    )
