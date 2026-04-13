import google.generativeai as genai
import os
import json
import re
from ..core.config import settings

class AudioDiagnosisService:
    def __init__(self):
        self.initialized = False
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-flash-latest')
            self.initialized = True

    def diagnose(self, audio_path: str):
        if not self.initialized:
            return "Demo: Normal Clucking", 0.98, "low"

        try:
            # Upload the file to Gemini
            audio_file = genai.upload_file(path=audio_path)
            
            prompt = """
            Listen to this poultry audio recording. 
            Identify if you hear signs of respiratory distress like wheezing, gasping, coughing, or rales.
            Compare it against normal poultry sounds (clucking/peeping).
            
            Return ONLY a JSON object:
            {
                "symptom": "Brief description of symptom",
                "match_prob": 0.85,
                "urgency": "low/medium/high"
            }
            """
            
            response = self.model.generate_content([prompt, audio_file])
            text = response.text
            
            # Cleanup uploaded file
            genai.delete_file(audio_file.name)
            
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
                return data.get("symptom", "Normal"), data.get("match_prob", 0.5), data.get("urgency", "low")
            
            return "Audio Analysis Failed", 0.0, "low"

        except Exception as e:
            print(f"Gemini Audio Error: {e}")
            return "Respiratory Distress (Mock)", 0.88, "high"

audio_service = AudioDiagnosisService()
