# services/ai_service.py

import google.generativeai as genai
from utils.config import settings
import threading

# --- Gemini API Key Aggregator ---
class GeminiKeyManager:
    """
    Manages and rotates a list of Gemini API keys in a thread-safe manner.
    """
    def __init__(self):
        # Load the comma-separated keys from settings and split them into a list
        self.keys = [key.strip() for key in settings.GEMINI_API_KEYS.split(',') if key.strip()]
        if not self.keys:
            raise ValueError("GEMINI_API_KEYS environment variable is not set or is empty.")
        
        self.current_index = 0
        # A lock is crucial for web apps to prevent race conditions when multiple
        # requests try to get a key at the same time.
        self.lock = threading.Lock()
        print(f"Gemini Key Manager initialized with {len(self.keys)} keys.")

    def get_next_key(self):
        """
        Atomically gets the next key from the list in a round-robin fashion.
        """
        with self.lock:
            key = self.keys[self.current_index]
            self.current_index = (self.current_index + 1) % len(self.keys)
            print(f"Using Gemini key index: {self.current_index}") # For debugging
            return key

# Create a single instance of the manager to be used by the entire application
key_manager = GeminiKeyManager()
GEMINI_MODEL_NAME = "gemini-1.5-flash" # Use the fast and capable Flash model

async def get_solution_gemini(assignment_text: str) -> str:
    """
    Gets a solution from Gemini, using a rotated API key.
    """
    try:
        api_key = key_manager.get_next_key()
        genai.configure(api_key=api_key)
        
        model = genai.GenerativeModel(GEMINI_MODEL_NAME)
        prompt = f"You are an expert academic assistant. Provide a clear, accurate, and well-structured answer to the following assignment questions.\n\nAssignment: {assignment_text}"
        
        response = await model.generate_content_async(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"An unexpected error occurred with Gemini: {e}")
        # This could be a content safety block or an invalid key error
        raise

async def paraphrase_solution_gemini(solution_text: str) -> str:
    """
    Paraphrases a solution using Gemini, using a rotated API key.
    """
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
    try:
        api_key = key_manager.get_next_key()
        genai.configure(api_key=api_key)

        model = genai.GenerativeModel(GEMINI_MODEL_NAME)
        response = await model.generate_content_async(paraphrase_prompt)
        return response.text.strip()
    except Exception as e:
        print(f"An unexpected error occurred during Gemini paraphrasing: {e}")
        raise