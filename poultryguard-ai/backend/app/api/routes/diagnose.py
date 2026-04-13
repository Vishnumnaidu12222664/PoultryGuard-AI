from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
import shutil
import os
import uuid
from ...core.database import get_db
from ...models.models import ImageDiagnosis, AudioDiagnosis, Flock
from ...schemas.schemas import ImageDiagnosisResponse, AudioDiagnosisResponse
from ...services.ai_image import image_service
from ...services.ai_audio import audio_service

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/image", response_model=ImageDiagnosisResponse)
async def diagnose_image(
    flock_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Save file
    file_ext = file.filename.split(".")[-1]
    file_name = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ML Inference
    disease, confidence, severity = image_service.predict(file_path)
    action = image_service.get_recommended_action(disease)

    # Save to DB
    diagnosis = ImageDiagnosis(
        flock_id=flock_id,
        image_path=file_path,
        disease=disease,
        confidence=confidence,
        severity=severity,
        action=action
    )
    db.add(diagnosis)
    db.commit()
    db.refresh(diagnosis)
    
    return diagnosis

@router.post("/audio", response_model=AudioDiagnosisResponse)
async def diagnose_audio(
    flock_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Save file
    file_ext = file.filename.split(".")[-1]
    file_name = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Audio Inference
    symptom, disease_match, urgency = audio_service.diagnose(file_path)

    # Save to DB
    diagnosis = AudioDiagnosis(
        flock_id=flock_id,
        audio_path=file_path,
        symptom=symptom,
        disease_match=disease_match,
        urgency=urgency
    )
    db.add(diagnosis)
    db.commit()
    db.refresh(diagnosis)
    
    return diagnosis
