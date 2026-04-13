from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum, Date, Text, Numeric, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    phone = Column(String(20))
    role = Column(Enum('admin', 'farmer', 'vet'), default='farmer')
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farms = relationship("Farm", back_populates="owner")
    chat_sessions = relationship("ChatSession", back_populates="user")

class Farm(Base):
    __tablename__ = "farms"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(255), nullable=False)
    location = Column(String(255))
    lat = Column(DECIMAL(10, 8))
    lng = Column(DECIMAL(11, 8))
    flock_size = Column(Integer)
    farm_type = Column(String(100))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="farms")
    flocks = relationship("Flock", back_populates="farm")
    outbreak_predictions = relationship("OutbreakPrediction", back_populates="farm")
    economic_predictions = relationship("EconomicPrediction", back_populates="farm")

class Flock(Base):
    __tablename__ = "flocks"
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"))
    breed = Column(String(100))
    age_weeks = Column(Integer)
    count = Column(Integer)
    batch_name = Column(String(255))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farm = relationship("Farm", back_populates="flocks")
    image_diagnoses = relationship("ImageDiagnosis", back_populates="flock")
    audio_diagnoses = relationship("AudioDiagnosis", back_populates="flock")
    vaccinations = relationship("Vaccination", back_populates="flock")
    medication_logs = relationship("MedicationLog", back_populates="flock")

class ImageDiagnosis(Base):
    __tablename__ = "image_diagnoses"
    id = Column(Integer, primary_key=True, index=True)
    flock_id = Column(Integer, ForeignKey("flocks.id"))
    image_path = Column(String(500), nullable=False)
    disease = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    severity = Column(Enum('mild', 'moderate', 'severe'), nullable=False)
    action = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    flock = relationship("Flock", back_populates="image_diagnoses")

class AudioDiagnosis(Base):
    __tablename__ = "audio_diagnoses"
    id = Column(Integer, primary_key=True, index=True)
    flock_id = Column(Integer, ForeignKey("flocks.id"))
    audio_path = Column(String(500), nullable=False)
    symptom = Column(String(255), nullable=False)
    disease_match = Column(Float)
    urgency = Column(Enum('low', 'medium', 'high'), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    flock = relationship("Flock", back_populates="audio_diagnoses")

class OutbreakPrediction(Base):
    __tablename__ = "outbreak_predictions"
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"))
    infected_count = Column(Integer, nullable=False)
    peak_day = Column(Integer)
    total_affected = Column(Integer)
    r0_value = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farm = relationship("Farm", back_populates="outbreak_predictions")

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    session_id = Column(String(100), unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), ForeignKey("chat_sessions.session_id"))
    role = Column(Enum('user', 'assistant'), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")

class Vaccination(Base):
    __tablename__ = "vaccinations"
    id = Column(Integer, primary_key=True, index=True)
    flock_id = Column(Integer, ForeignKey("flocks.id"))
    vaccine_name = Column(String(255), nullable=False)
    due_date = Column(Date, nullable=False)
    administered_date = Column(Date, nullable=True)
    notes = Column(Text)
    status = Column(Enum('pending', 'completed', 'overdue'), default='pending')

    flock = relationship("Flock", back_populates="vaccinations")

class MedicationLog(Base):
    __tablename__ = "medication_logs"
    id = Column(Integer, primary_key=True, index=True)
    flock_id = Column(Integer, ForeignKey("flocks.id"))
    drug_name = Column(String(255), nullable=False)
    dosage = Column(String(100), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    notes = Column(Text)

    flock = relationship("Flock", back_populates="medication_logs")

class EconomicPrediction(Base):
    __tablename__ = "economic_predictions"
    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"))
    disease = Column(String(255))
    flock_size = Column(Integer)
    days_detected = Column(Integer)
    projected_loss = Column(Numeric(15, 2))
    currency = Column(String(10), default='USD')
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farm = relationship("Farm", back_populates="economic_predictions")

