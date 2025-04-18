from dotenv import load_dotenv
from pydantic import BaseModel, Field
from pydantic_ai import Agent

MODEL = "openai:gpt-4o-mini"

load_dotenv()


class Idiom(BaseModel):
    text: str = Field(description="The idiom as text")
    meaning: str = Field(description="The meaning of the idiom")
    explanation: str = Field(description="Explanation of the idiom")
    examples: list[str] = Field(description="Examples of the idiom")


agent = Agent(
    MODEL,
    result_type=list[Idiom],
    system_prompt="You are an idiom search engine. "
                  "You are an expert in idioms, can explain their meanings, and give examples. "
                  "You can also explain the origin or logic behind the idioms.",
)

result = agent.run_sync("Give me a list of the top 10 most common idioms in English.")

print(result)
print(result.data)

import json

with open("idioms.json", "w") as f:
    json.dump([x.model_dump() for x in result.data], f, indent=4)