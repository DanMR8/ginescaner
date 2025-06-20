# sesiones.py============================================
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud, auth, database, models

router = APIRouter()

db_dependency = Depends(database.get_db)

@router.post("/sesiones", response_model=schemas.SesionOut)
def crear_sesion(
    sesion: schemas.SesionCreate,
    db: Session = db_dependency,
    id_medico: int = Depends(auth.get_current_medico_id)
):
    return crud.create_sesion_con_medico(db, sesion, id_medico)

@router.get("/sesiones/ultima", response_model=schemas.SesionOut)
def obtener_ultima_sesion(
    db: Session = Depends(database.get_db),
    id_medico: int = Depends(auth.get_current_medico_id)
):
    ultima = (
        db.query(models.Sesion)
        .filter(models.Sesion.id_medico == id_medico)
        .order_by(models.Sesion.id_sesion.desc())
        .first()
    )

    if not ultima:
        raise HTTPException(status_code=404, detail="No hay sesiones registradas aún.")

    return ultima
# sesiones.py============================================
