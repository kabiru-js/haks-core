# models/assignment.py

from pydantic import BaseModel

class AssignmentResponse(BaseModel):
    original_answer: str
    paraphrased_answer: str