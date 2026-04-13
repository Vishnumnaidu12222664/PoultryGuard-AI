from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...core.database import get_db
from ...models.models import Vaccination
from ...schemas.schemas import VaccinationCreate, VaccinationResponse, VaccinationUpdate

router = APIRouter()

@router.get("/", response_model=List[VaccinationResponse])
def get_vaccinations(db: Session = Depends(get_db)):
    return db.query(Vaccination).all()

@router.post("/", response_model=VaccinationResponse)
def create_vaccination(vaccine: VaccinationCreate, db: Session = Depends(get_db)):
    new_vax = Vaccination(**vaccine.dict())
    db.add(new_vax)
    db.commit()
    db.refresh(new_vax)
    return new_vax

@router.put("/{vax_id}", response_model=VaccinationResponse)
def update_vaccination(vax_id: int, vaccine_in: VaccinationUpdate, db: Session = Depends(get_db)):
    vax = db.query(Vaccination).filter(Vaccination.id == vax_id).first()
    if not vax:
        raise HTTPException(status_code=404, detail="Vaccination not found")
    
    update_data = vaccine_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(vax, key, value)
    
    if vax.administered_date:
        vax.status = 'completed'
        
    db.commit()
    db.refresh(vax)
    return vax

@router.delete("/{vax_id}")
def delete_vaccination(vax_id: int, db: Session = Depends(get_db)):
    vax = db.query(Vaccination).filter(Vaccination.id == vax_id).first()
    if not vax:
        raise HTTPException(status_code=404, detail="Vaccination not found")
    db.delete(vax)
    db.commit()
    return {"message": "Deleted successfully"}
