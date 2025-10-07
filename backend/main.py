# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict
import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load .env
load_dotenv()

app = FastAPI()

# ✅ Allow requests from Angular frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Gemini API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# ✅ Request body
class ItineraryRequest(BaseModel):
    destination: str
    duration: int
    budget: int
    travelers: int
    preferences: Dict[str, bool]

@app.post("/api/generate-itinerary")
async def generate_itinerary(req: ItineraryRequest):
    try:
        prompt = f"""
        Create a detailed travel itinerary for {req.travelers} travelers visiting {req.destination} 
        for {req.duration} days with a budget of {req.budget} USD. 
        Include activities and recommendations based on preferences: {req.preferences}.
        """

        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)

        return {"itinerary": response.text or "⚠️ No content generated."}
    except Exception as e:
        print("Error generating itinerary:", e)
        return {"itinerary": "⚠️ Failed to generate itinerary. Please try again."}
