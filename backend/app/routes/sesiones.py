from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import schemas, crud, auth, database

router = APIRouter()

db_dependency = Depends(database.get_db)

@router.post("/sesiones", response_model=schemas.SesionOut)
def crear_sesion(
    sesion: schemas.SesionCreate,
    db: Session = db_dependency,
    id_medico: int = Depends(auth.get_current_medico_id)
):
    return crud.create_sesion_con_medico(db, sesion, id_medico)
