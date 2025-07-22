# utils/config.py

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Add the new variable for the list of Gemini keys
    GEMINI_API_KEYS: str

    # Keep old keys for reference or future use if needed
    GROQ_API_KEY: str = "not_set"
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"

    # Load from .env file, ignore any extras from other projects
    model_config = SettingsConfigDict(env_file=".env", extra='ignore')

settings = Settings()