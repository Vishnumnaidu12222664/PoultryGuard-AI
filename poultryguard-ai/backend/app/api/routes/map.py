from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ...core.database import get_db
from ...models.models import ImageDiagnosis, Farm, Flock

router = APIRouter()

@router.get("/outbreaks")
def get_map_outbreaks(db: Session = Depends(get_db)):
    # Join ImageDiagnosis with Flock and Farm to get coordinates
    results = db.query(
        ImageDiagnosis.disease,
        ImageDiagnosis.severity,
        ImageDiagnosis.created_at,
        Farm.lat,
        Farm.lng
    ).join(Flock, ImageDiagnosis.flock_id == Flock.id)\
     .join(Farm, Flock.farm_id == Farm.id).all()
    
    outbreaks = []
    for res in results:
        outbreaks.append({
            "disease": res.disease,
            "severity": res.severity,
            "date": res.created_at.isoformat(),
            "lat": float(res.lat) if res.lat else 0.0,
            "lng": float(res.lng) if res.lng else 0.0
        })
    
    return outbreaks
