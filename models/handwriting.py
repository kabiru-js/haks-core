# models/handwriting.py

from pydantic import BaseModel

class HandwritingRequest(BaseModel):
    text: str