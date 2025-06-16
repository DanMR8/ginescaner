# pacientes.py ==============================================
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud, auth, database,models
from app.schemas import PacienteRegistro
from app.models import User
from app.auth import get_current_user
from app.database import get_db

router = APIRouter()

db_dependency = Depends(database.get_db)
user_dependency = Depends(auth.get_current_user)


@router.post("/pacientes/registro", response_model=schemas.PacienteOut)
def registrar_paciente_completo(
    paciente: schemas.PacienteRegistro,
    db: Session = Depends(database.get_db),
    current_user = Depends(auth.get_current_user)
):
    return crud.create_paciente_con_usuario(db, paciente)

@router.get("/pacientes/buscar")
def buscar_pacientes(nombre: str = "", apellidos: str = "", db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    pacientes = db.query(models.User).join(models.Paciente).filter(
        models.User.tipo == "paciente",
        models.User.nombre.ilike(f"%{nombre}%"),
        models.User.apellidos.ilike(f"%{apellidos}%")
    ).all()
    return pacientes

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
# pacientes.py ==============================================