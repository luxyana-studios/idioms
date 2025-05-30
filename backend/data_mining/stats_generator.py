import json

from dotenv import load_dotenv
from pydantic import BaseModel, Field
from pydantic_ai import Agent

MODEL = "openai:gpt-4o-mini"

load_dotenv()

STATS_FILENAME = "stats_chunk"
STATS_PROMPT = (
    "You are an idiom analysis engine. "
    "You are an expert in idioms and their idiomatic usage. "
    "You have an excellent understanding of idioms and can intuitively assess their attributes. "
    "For each idiom provided, you will quickly analyze and return detailed statistics based on the following attributes:"
    "- Frequency of Use: Rate how often the idiom appears in written or spoken corpora on a scale from 0 to 10. "
    "- Category/Theme: Identify the theme(s) of the idiom (e.g., animals, weather, emotions, business, sports). "
    "- Sentiment: Describe the overall connotation of the idiom (e.g., positive, negative, neutral, sarcastic, humorous). "
    "- Context Diversity: List the number of different contexts/fields (e.g., business, sports, daily life, education, entertainment) where the idiom is used. "
    "- Literal Transparency: Rate how easy it is to guess the meaning of the idiom from its literal text on a scale from 0 to 10. "
    "- Translation Difficulty: Rate how challenging it is to translate the idiom into other languages on a scale from 0 to 10. "
    "Provide the analysis for each idiom in a structured format. "
    "I'm going to give you a list of idioms as a bulleted list. "
    "Give me back the same list but with each idiom analyzed according to the attributes above. "
    "You are quick and efficient, you keep your answers concise and to the point, you prioritize speed over accuracy, "
    "you do not need to provide explanations or justifications for your ratings. "
)


class IdiomAttributes(BaseModel):
    text: str = Field(description="The idiom as text")
    frequency_of_use: float = Field(
        ge=0,
        le=10,
        description="How often each idiom appears in written or spoken corpora. Value should be between 0 and 10.",
    )
    category_theme: list[str] = Field(
        description="Grouping idioms by themes (e.g., animals, weather, emotions, business, sports). This is not an exhaustive list."
    )
    sentiment: list[str] = Field(
        description="Overall connotation (e.g., positive, negative, neutral, sarcastic, humorous). This is not an exhaustive list."
    )
    context_diversity: list[str] = Field(
        description="Different contexts/fields (e.g., business, sports, daily life, education, entertainment) where the idiom is used. This is not an exhaustive list."
    )
    literal_transparency: float = Field(
        ge=0,
        le=10,
        description="How easy it is to guess the meaning from the words. Value should be between 0 and 10.",
    )
    translation_difficulty: float = Field(
        ge=0,
        le=10,
        description="How challenging it is to translate into other languages. Value should be between 0 and 10.",
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
