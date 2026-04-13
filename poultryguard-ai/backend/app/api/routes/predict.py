from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...models.models import OutbreakPrediction
from ...schemas.schemas import OutbreakPredictionRequest, OutbreakPredictionResponse
from ...services.ai_outbreak import outbreak_predictor

router = APIRouter()

@router.post("/outbreak", response_model=OutbreakPredictionResponse)
def predict_outbreak(
    req: OutbreakPredictionRequest,
    db: Session = Depends(get_db)
):
    # SIR Model Prediction
    daily_data, peak_day, total_affected, r0_value = outbreak_predictor.predict(
        N=req.flock_size,
        I0=req.infected_count
    )

    # Save summary to DB
    pred = OutbreakPrediction(
        farm_id=req.farm_id,
        infected_count=req.infected_count,
        peak_day=peak_day,
        total_affected=total_affected,
        r0_value=r0_value
    )
    db.add(pred)
    db.commit()
    
    return {
        "daily_data": daily_data,
        "peak_day": peak_day,
        "total_affected": total_affected,
        "r0_value": r0_value
    }
