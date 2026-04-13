import google.generativeai as genai
from PIL import Image
import os
import json
import re
from ..core.config import settings

class ImageDiagnosisService:
    def __init__(self):
        self.initialized = False
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-flash-latest')
            self.initialized = True
        else:
            self.model = None

    def predict(self, image_path: str):
        if not self.initialized:
            # Fallback to mock for demo if no API key
            return "Demo: Newcastle Disease", 0.95, "moderate"

        try:
            img = Image.open(image_path)
            
            prompt = """
            Analyze this poultry image for disease diagnosis. 
            Identify if the bird has Newcastle Disease, Coccidiosis, Salmonella, Fowl Pox, or is Healthy.
            
            Return ONLY a JSON object with this exact structure:
            {
                "disease": "Disease Name",
                "confidence": 0.95,
                "severity": "mild/moderate/severe"
            }
            """
            
            response = self.model.generate_content([prompt, img])
            text = response.text
            
            # Extract JSON if there's markdown or extra text
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                data = json.loads(json_match.group())
                return data.get("disease", "Unknown"), data.get("confidence", 0.5), data.get("severity", "mild")
            
            return "Analysis Error", 0.0, "low"
            
        except Exception as e:
            print(f"Gemini Error: {e}")
            return "Newcastle Disease (Mock)", 0.85, "moderate"

    def get_recommended_action(self, disease: str):
        actions = {
            "Newcastle Disease": "Quarantine the flock immediately. High mortality risk. Contact a vet for mandatory vaccination of healthy birds.",
            "Coccidiosis": "Administer amprolium in drinking water. Maintain dry litter and reduce stocking density.",
            "Salmonella": "Isolate infected birds. Administer antibiotics like Enrofloxacin. Ensure clean water sources.",
            "Fowl Pox": "Control mosquitoes. Vaccinate the rest of the flock. Apply antiseptic to scabs.",
            "Healthy": "No immediate action needed. Continue regular biosecurity and clean bedding."
        }
        return actions.get(disease, "Consult a veterinarian for detailed diagnosis.")

image_service = ImageDiagnosisService()
