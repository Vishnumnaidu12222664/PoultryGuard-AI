from app.core.database import engine
from app.models.models import Base

def init_db():
    print("Initializing MySQL database and creating tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully.")
    except Exception as e:
        print(f"Error initializing database: {e}")
        print("Make sure your MySQL server is running and the database 'poultryguard_db' exists.")

if __name__ == "__main__":
    init_db()
