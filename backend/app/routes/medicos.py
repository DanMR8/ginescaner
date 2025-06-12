#// medicos.py=========================================================
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud, database

router = APIRouter()
get_db = database.get_db

@router.post("/medicos", response_model=schemas.MedicoOut)
def crear_medico(medico: schemas.MedicoCreate, db: Session = Depends(get_db)):
    existente = crud.get_medico_by_user(db, medico.user_id)
    if existente:
        raise HTTPException(status_code=400, detail="Este usuario ya tiene datos médicos registrados.")
    return crud.create_medico(db, medico)
#// medicos.py=========================================================