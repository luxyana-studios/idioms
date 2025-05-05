import json

from dotenv import load_dotenv
from pydantic import BaseModel, Field
from pydantic_ai import Agent

MODEL = "openai:gpt-4o-mini"

load_dotenv()


class Idiom(BaseModel):
    text: str = Field(description="The idiom or phrase as text")


agent = Agent(
    MODEL,
    result_type=list[Idiom],
    system_prompt="You are an idiom search engine. "
    "You are an expert in idioms and phrases. You can provide endless list of well-known and also not so more exotic idioms, phrases and manners of speech."
    "You are very creative and very well read. You know all idioms and phrases in the world in any given language",
)

result = agent.run_sync(
    "Give me a list of 150 different idioms or phrases used in English."
)

print(result)
print(result.data)

with open("miner_list.json", "w") as f:
    json.dump([x.model_dump() for x in result.data], f, indent=4)
