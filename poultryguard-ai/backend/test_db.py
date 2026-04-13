
import sys
import os
import urllib.parse
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))
load_dotenv('backend/.env')

def test_db_connection():
    print("Testing Database Connection...")
    user = os.getenv("MYSQL_USER")
    password = urllib.parse.quote_plus(os.getenv("MYSQL_PASSWORD"))
    server = os.getenv("MYSQL_SERVER")
    port = os.getenv("MYSQL_PORT")
    db_name = os.getenv("MYSQL_DB")
    
    SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{user}:{password}@{server}:{port}/{db_name}"
    
    try:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("[OK] Database connection successful.")
            
            # Check if tables exist
            result = connection.execute(text("SHOW TABLES"))
            tables = [row[0] for row in result]
            print(f"Tables found: {tables}")
            
    except Exception as e:
        print(f"[FAIL] Database connection failed: {e}")

if __name__ == "__main__":
    test_db_connection()
