from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Literal
from datetime import datetime, date

# --- Auth ---
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    role: Literal['admin', 'farmer', 'vet'] = 'farmer'

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# --- Farm & Flock ---
class FarmBase(BaseModel):
    name: str
    location: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    flock_size: Optional[int] = None
    farm_type: Optional[str] = None

class FarmCreate(FarmBase):
    pass

class FarmResponse(FarmBase):
    id: int
    user_id: int
    created_at: datetime
    class Config:
        from_attributes = True

class FlockBase(BaseModel):
    farm_id: int
    breed: Optional[str] = None
    age_weeks: Optional[int] = None
    count: Optional[int] = None
    batch_name: Optional[str] = None

class FlockCreate(FlockBase):
    pass

class FlockResponse(FlockBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- Diagnoses ---
class ImageDiagnosisResponse(BaseModel):
    id: int
    flock_id: int
    image_path: str
    disease: str
    confidence: float
    severity: str
    action: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

class AudioDiagnosisResponse(BaseModel):
    id: int
    flock_id: int
    audio_path: str
    symptom: str
    disease_match: float
    urgency: str
    created_at: datetime
    class Config:
        from_attributes = True

# --- Predictions ---
class OutbreakPredictionRequest(BaseModel):
    farm_id: int
    flock_size: int
    infected_count: int
    ventilation_type: Optional[str] = "natural"

class OutbreakPredictionResponse(BaseModel):
    daily_data: List[dict]
    peak_day: int
    total_affected: int
    r0_value: float

class EconomicLossRequest(BaseModel):
    farm_id: int
    disease: str
    flock_size: int
    days_since_detection: int
    treatment_status: bool = False
    revenue_per_bird: float = 1.0
    currency: str = "USD"

class EconomicLossResponse(BaseModel):
    projected_deaths: int
    percent_loss: float
    revenue_loss: float
    currency: str

# --- Vaccination & Medication ---
class VaccinationBase(BaseModel):
    flock_id: int
    vaccine_name: str
    due_date: date
    notes: Optional[str] = None

class VaccinationCreate(VaccinationBase):
    pass

class VaccinationUpdate(BaseModel):
    administered_date: Optional[date] = None
    status: Optional[Literal['pending', 'completed', 'overdue']] = None

class VaccinationResponse(VaccinationBase):
    id: int
    administered_date: Optional[date] = None
    status: str
    class Config:
        from_attributes = True

class MedicationLogBase(BaseModel):
    flock_id: int
    drug_name: str
    dosage: str
    start_date: date
    end_date: date
    notes: Optional[str] = None

class MedicationLogCreate(MedicationLogBase):
    pass

class MedicationLogResponse(MedicationLogBase):
    id: int
    class Config:
        from_attributes = True

# --- Chat ---
class ChatMessageRequest(BaseModel):
    session_id: str
    content: str

class ChatMessageResponse(BaseModel):
    content: str
    reasoning: Optional[str] = None
    recommended_action: Optional[str] = None
