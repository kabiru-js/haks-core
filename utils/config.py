# utils/config.py

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    OPENAI_API_BASE: str = "https://openrouter.ai/api/v1"
    OPENAI_MODEL_NAME: str = "openai/gpt-4-turbo-preview"

    # Load from .env file
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()