from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.models import Base, User, Farm, Flock, ImageDiagnosis
import datetime
from decimal import Decimal

def seed():
    db = SessionLocal()
    
    # Check if we have an admin or farmer
    user = db.query(User).filter(User.email == "farmer@poultryguard.in").first()
    if not user:
        user = User(
            name="Indian Farmer",
            email="farmer@poultryguard.in",
            password_hash="pbkdf2:sha256:260000$xxxx", # Placeholder
            role="farmer"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Coordinates for major Indian poultry hubs
    indian_farms = [
        {"name": "Bangalore North Cluster", "lat": 12.9716, "lng": 77.5946, "disease": "Newcastle Disease", "severity": "severe"},
        {"name": "Hyderabad Central Farm", "lat": 17.3850, "lng": 78.4867, "disease": "Coccidiosis", "severity": "moderate"},
        {"name": "Pune Agri-Hub", "lat": 18.5204, "lng": 73.8567, "disease": "Fowl Pox", "severity": "mild"},
        {"name": "Delhi NCR Sector 4", "lat": 28.6139, "lng": 77.2090, "disease": "Newcastle Disease", "severity": "severe"},
        {"name": "Coimbatore Farm Matrix", "lat": 11.0168, "lng": 76.9558, "disease": "Coccidiosis", "severity": "moderate"}
    ]

    for farm_data in indian_farms:
        # Create Farm
        farm = Farm(
            user_id=user.id,
            name=farm_data["name"],
            location="India",
            lat=Decimal(str(farm_data["lat"])),
            lng=Decimal(str(farm_data["lng"])),
            flock_size=10000,
            farm_type="Broiler"
        )
        db.add(farm)
        db.commit()
        db.refresh(farm)

        # Create Flock
        flock = Flock(
            farm_id=farm.id,
            breed="Ross 308",
            age_weeks=4,
            count=10000,
            batch_name=f"Batch_{farm_data['name'].split()[0]}"
        )
        db.add(flock)
        db.commit()
        db.refresh(flock)

        # Create Diagnosis (for map data)
        diagnosis = ImageDiagnosis(
            flock_id=flock.id,
            image_path="seed_data/outbreak.jpg",
            disease=farm_data["disease"],
            confidence=0.92,
            severity=farm_data["severity"],
            action="Strict quarantine and administration of antiviral support."
        )
        db.add(diagnosis)
        db.commit()

    print("Successfully seeded Indian farm nodes and disease hotspots.")
    db.close()

if __name__ == "__main__":
    seed()
