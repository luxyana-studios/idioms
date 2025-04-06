from dotenv import load_dotenv
from pydantic import BaseModel, Field
from pydantic_ai import Agent

MODEL = "openai:gpt-4o-mini"

load_dotenv()


class PhilospherQuote(BaseModel):
    author: str = Field(description="The author of the quote")
    quote: str = Field(description="The quote as text")
    year: int = Field(description="The year of the quote")


agent = Agent(
    MODEL,
    result_type=PhilospherQuote,
    system_prompt=("You are a philosopher quote generator."),
)

result = agent.run_sync("Give a good quote from a famous philosopher at random.")

print(result)
print(result.data)
