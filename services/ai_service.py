# services/ai_service.py

from openai import OpenAI
from utils.config import settings
import httpx # Make sure httpx is imported

# --------------------------------------------------------------------------
# --- Original OpenRouter/OpenAI Client (kept for reference or future use) ---
# --------------------------------------------------------------------------
# client = OpenAI(
#     api_key=settings.OPENAI_API_KEY,
#     base_url=settings.OPENAI_API_BASE,
# )

# PARAPHRASE_PROMPT_OPENAI = """
# Take the following AI-written academic answer and rewrite it...
# "{text}"
# """

# async def get_solution(assignment_text: str) -> str:
#     # ... implementation for OpenAI ...
#     pass

# async def paraphrase_solution(solution_text: str) -> str:
#     # ... implementation for OpenAI ...
#     pass

# --------------------------------------------------------------------------
# --- NEW: Ollama Integration ---
# --------------------------------------------------------------------------

OLLAMA_API_URL = "http://localhost:11434/api/chat" # Use the chat endpoint
OLLAMA_MODEL_NAME = "llama3:8b-instruct-q4_K_M" # The model you pulled with 'ollama pull'

async def get_solution_ollama(assignment_text: str) -> str:
    """
    Gets a solution from a local Ollama model using its chat endpoint.
    """
    payload = {
        "model": OLLAMA_MODEL_NAME,
        "messages": [
            {"role": "system", "content": "You are an expert academic assistant. Provide a clear, accurate, and well-structured answer to the following assignment questions."},
            {"role": "user", "content": assignment_text}
        ],
        "stream": False # We want the full response at once
    }

    try:
        # Use a longer timeout as local models can sometimes be slow to start
        async with httpx.AsyncClient(timeout=180.0) as client:
            response = await client.post(OLLAMA_API_URL, json=payload)
            response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)
        
        response_data = response.json()
        # The actual text response is nested in the 'message' object
        return response_data.get("message", {}).get("content", "").strip()

    except httpx.RequestError as e:
        print(f"Ollama connection error: {e}")
        raise Exception("Could not connect to the local Ollama server. Please ensure Ollama is running.")
    except Exception as e:
        print(f"An unexpected error occurred with Ollama: {e}")
        raise

async def paraphrase_solution_ollama(solution_text: str) -> str:
    """
    Paraphrases a solution using a local Ollama model.
    """
    # The prompt engineering from the original request
    paraphrase_prompt = f"""
Take the following AI-written academic answer and rewrite it to sound like a smart university student who is writing in their own words for a homework submission. 
- Keep the core meaning and all key points.
- Make the tone more natural and slightly informal.
- Use simpler sentence structures where appropriate.
- It should sound confident but not robotic. Avoid overly academic or complex vocabulary unless necessary for the topic.
- The output should be only the rewritten text, without any additional commentary.

Original Answer:
"{solution_text}"
"""
    
    payload = {
        "model": OLLAMA_MODEL_NAME,
        "messages": [
            {"role": "system", "content": "You are a skilled writer who can adopt different personas. Your task is to rewrite text to sound like a specific persona."},
            {"role": "user", "content": paraphrase_prompt}
        ],
        "stream": False
    }
    
    try:
        async with httpx.AsyncClient(timeout=180.0) as client:
            response = await client.post(OLLAMA_API_URL, json=payload)
            response.raise_for_status()
            response_data = response.json()
            return response_data.get("message", {}).get("content", "").strip()
            
    except Exception as e:
        print(f"Ollama paraphrasing error: {e}")
        raise