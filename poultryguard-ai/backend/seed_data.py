
import sys
import os
from passlib.hash import bcrypt

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))
from app.core.database import SessionLocal, engine
from app.models.models import User, Farm, Flock, Base

def seed_db():
    print("Seeding database with default data...")
    db = SessionLocal()
    try:
        # 1. Create User if not exists
        user = db.query(User).filter(User.email == "farmer@poultryguard.com").first()
        if not user:
            user = User(
                name="Agro Farmer",
                email="farmer@poultryguard.com",
                password_hash="demo_password_hash", # Simplified for seeding
                role="farmer"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"Created user: {user.email}")
        
        # 2. Create Farm if not exists
        farm = db.query(Farm).filter(Farm.user_id == user.id).first()
        if not farm:
            farm = Farm(
                user_id=user.id,
                name="Central Hatchery",
                flock_size=5000,
                farm_type="Broiler",
                lat=12.9716,
                lng=77.5946
            )
            db.add(farm)
            db.commit()
            db.refresh(farm)
            print(f"Created farm: {farm.name}")

        # 3. Create Flock if not exists (Ensure ID 1)
        # We manually check ID or just create one. If it's the first, it will be 1.
        flock = db.query(Flock).filter(Flock.id == 1).first()
        if not flock:
            flock = Flock(
                id=1, # Explicitly setting ID to 1 for frontend compatibility
                farm_id=farm.id,
                breed="White Leghorn",
                age_weeks=12,
                count=2500,
                batch_name="Batch-Alpha-2024"
            )
            db.add(flock)
            db.commit()
            print("Created default Flock (ID: 1)")
        else:
            print("Flock ID 1 already exists.")

        print("Seeding complete. Use ID 1 in frontend.")
        
    except Exception as e:
        print(f"Error seeding: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
