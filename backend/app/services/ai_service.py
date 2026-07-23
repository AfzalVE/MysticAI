import openai
from app.core.config import settings

openai.api_key = settings.AI_API_KEY
client = openai.AsyncOpenAI(api_key=settings.AI_API_KEY)

async def generate_fortune(name: str, dob: str, time: str, place: str) -> str:
    prompt = f"Act as an expert astrologer and fortune teller. Generate a detailed, mystical, and encouraging fortune for {name}, born on {dob} at {time if time else 'unknown time'} in {place if place else 'unknown place'}. Include horoscope, lucky number, lucky color, personality traits, career guidance, love compatibility, and daily prediction. Format it clearly."
    response = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": "You are a mystical AI fortune teller."},
                  {"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

async def interpret_tarot(cards: list, spread_type: str) -> str:
    card_names = ", ".join([c.name for c in cards])
    prompt = f"Act as an expert tarot reader. I have drawn the following cards for a {spread_type} spread: {card_names}. Please provide a deep, insightful interpretation of this combination."
    response = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": "You are a wise and insightful tarot card reader."},
                  {"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

async def chat_with_advisor(messages: list) -> str:
    formatted_msgs = [{"role": "system", "content": "You are a spiritual advisor, astrologer, and tarot expert. Guide the user with wisdom and empathy."}]
    for msg in messages:
        formatted_msgs.append({"role": msg.role, "content": msg.content})
        
    response = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=formatted_msgs
    )
    return response.choices[0].message.content
