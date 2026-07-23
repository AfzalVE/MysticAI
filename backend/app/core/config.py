from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MysticAI"
    MONGO_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "mysticai"
    AI_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
