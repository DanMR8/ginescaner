from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud, auth, database

router = APIRouter()

db_dependency = Depends(database.get_db)
user_dependency = Depends(auth.get_current_user)

@router.get("/pacientes", response_model=list[schemas.PacienteOut])
def listar_pacientes(db: Session = db_dependency, current_user = user_dependency):
    return crud.get_pacientes(db)

@router.post("/pacientes", response_model=schemas.PacienteOut)
def crear_paciente(paciente: schemas.PacienteCreate, db: Session = db_dependency, current_user = user_dependency):
    return crud.create_paciente(db, paciente)

@router.get("/pacientes/{paciente_id}", response_model=schemas.PacienteOut)
def obtener_paciente(paciente_id: int, db: Session = db_dependency, current_user = user_dependency):
    paciente = crud.get_paciente(db, paciente_id)
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    return paciente

@router.put("/pacientes/{paciente_id}", response_model=schemas.PacienteOut)
def actualizar_paciente(paciente_id: int, paciente: schemas.PacienteCreate, db: Session = db_dependency, current_user = user_dependency):
    return crud.update_paciente(db, paciente_id, paciente)

@router.delete("/pacientes/{paciente_id}")
def eliminar_paciente(paciente_id: int, db: Session = db_dependency, current_user = user_dependency):
    return crud.delete_paciente(db, paciente_id)