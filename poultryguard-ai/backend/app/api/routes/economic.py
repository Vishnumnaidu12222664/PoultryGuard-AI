from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...models.models import EconomicPrediction
from ...schemas.schemas import EconomicLossRequest, EconomicLossResponse
from ...services.ai_economic import economic_predictor

router = APIRouter()

@router.post("/loss", response_model=EconomicLossResponse)
def predict_economic_loss(
    req: EconomicLossRequest,
    db: Session = Depends(get_db)
):
    projected_deaths, percent_loss, revenue_loss = economic_predictor.predict_loss(
        days=req.days_since_detection,
        flock_size=req.flock_size,
        treatment=req.treatment_status,
        revenue_per_bird=req.revenue_per_bird
    )

    # Save to DB
    pred = EconomicPrediction(
        farm_id=req.farm_id,
        disease=req.disease,
        flock_size=req.flock_size,
        days_detected=req.days_since_detection,
        projected_loss=revenue_loss,
        currency=req.currency
    )
    db.add(pred)
    db.commit()

    return {
        "projected_deaths": projected_deaths,
        "percent_loss": percent_loss,
        "revenue_loss": revenue_loss,
        "currency": req.currency
    }
