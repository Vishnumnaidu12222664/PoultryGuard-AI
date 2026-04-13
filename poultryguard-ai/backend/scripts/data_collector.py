import os
import requests
import zipfile
from tqdm import tqdm

DATA_DIR = os.path.join(os.path.dirname(__file__), "../../data")
os.makedirs(DATA_DIR, exist_ok=True)

class DataCollector:
    """
    Downloads and prepares poultry datasets from Kaggle, Roboflow, and FAO.
    Note: Requires Kaggle/Roboflow API keys in environment variables for full automation.
    """
    
    @staticmethod
    def download_fao_guidelines():
        """Downloads FAO poultry disease PDF reports for the RAG knowledge base."""
        print("📥 Downloading FAO Poultry Disease Guidelines...")
        urls = [
            "https://www.fao.org/3/a0515e/a0515e.pdf", # Small-scale poultry production
            "https://www.fao.org/3/i0695e/i0695e.pdf", # Biosecurity guide
            "https://www.fao.org/3/i2544e/i2544e.pdf"  # Disease surveillance
        ]
        
        docs_dir = os.path.join(DATA_DIR, "knowledge_base")
        os.makedirs(docs_dir, exist_ok=True)
        
        for i, url in enumerate(urls):
            try:
                response = requests.get(url, stream=True)
                file_path = os.path.join(docs_dir, f"fao_guide_{i}.pdf")
                with open(file_path, "wb") as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                print(f"✅ Saved: {file_path}")
            except Exception as e:
                print(f"❌ Failed to download {url}: {e}")

    @staticmethod
    def prepare_kaggle_data():
        """
        Instructions for Kaggle Poultry Disease Dataset
        https://www.kaggle.com/datasets/vencerlanz09/poultry-diseases-20k
        """
        print("\n💡 To download the Kaggle Dataset (~3,000 images, 4 classes):")
        print("1. Set KAGGLE_USERNAME and KAGGLE_KEY in your env.")
        print("2. Run: kaggle datasets download -d vencerlanz09/poultry-diseases-20k")
        print("3. Unzip to: backend/data/images/")

    @staticmethod
    def prepare_audio_samples():
        """Instructions for Xeno-canto audio samples."""
        print("\n💡 For Audio Samples (Respiratory Distress):")
        print("Use the Xeno-canto API: https://www.xeno-canto.org/api/2/recordings?query=poultry+coughing")
        print("Samples should be converted to .wav and placed in: backend/data/audio/")

if __name__ == "__main__":
    collector = DataCollector()
    collector.download_fao_guidelines()
    collector.prepare_kaggle_data()
    collector.prepare_audio_samples()
