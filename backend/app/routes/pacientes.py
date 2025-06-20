# pacientes.py ==============================================
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud, auth, database,models
from app.schemas import PacienteRegistro
from app.models import User
from app.auth import get_current_user
from app.database import get_db
from typing import List

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

# @router.get("/pacientes/buscar")
# def buscar_pacientes(nombre: str = "", apellidos: str = "", db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
#     pacientes = db.query(models.User).join(models.Paciente).filter(
#         models.User.tipo == "paciente",
#         models.User.nombre.ilike(f"%{nombre}%"),
#         models.User.apellidos.ilike(f"%{apellidos}%")
#     ).all()
#     return pacientes
@router.get("/pacientes/buscar", response_model=List[schemas.PacienteConUsuario])
def buscar_pacientes(
    nombre: str = "",
    apellidos: str = "",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    pacientes = (
        db.query(
            models.Paciente.id_paciente.label("id_paciente"),
            models.Paciente.id_usuario,
            models.Paciente.fecha_nacimiento,
            models.Paciente.telefono,
            models.Paciente.contacto_emergencia,
            models.Paciente.alergias,
            models.Paciente.enfermedades_cronicas,
            models.User.nombre.label("nombre"),
            models.User.apellidos.label("apellidos"),
            models.User.email.label("email"),
        )
        .join(models.User, models.User.id == models.Paciente.id_usuario)
        .filter(
            models.User.tipo == "paciente",
            models.User.nombre.ilike(f"%{nombre}%"),
            models.User.apellidos.ilike(f"%{apellidos}%")
        )
        .all()
    )
    return pacientes

@router.get("/pacientes", response_model=list[schemas.PacienteOut])
def listar_pacientes(db: Session = db_dependency, current_user = user_dependency):
    return crud.get_pacientes(db)

@router.post("/pacientes", response_model=schemas.PacienteOut)
def crear_paciente(paciente: schemas.PacienteCreate, db: Session = db_dependency, current_user = user_dependency):
    return crud.create_paciente(db, paciente)

# @router.get("/pacientes/{paciente_id}", response_model=schemas.PacienteOut)
# def obtener_paciente(paciente_id: int, db: Session = db_dependency, current_user = user_dependency):
#     paciente = crud.get_paciente(db, paciente_id)
#     if not paciente:
#         raise HTTPException(status_code=404, detail="Paciente no encontrado")
#     return paciente

@router.get("/pacientes/{paciente_id}", response_model=schemas.PacienteExtendido)
def obtener_paciente_con_usuario(paciente_id: int, db: Session = db_dependency, current_user = user_dependency):
    resultado = (
        db.query(
            models.Paciente.id_paciente,
            models.Paciente.id_usuario,
            models.Paciente.fecha_nacimiento,
            models.Paciente.telefono,
            models.Paciente.contacto_emergencia,
            models.Paciente.alergias,
            models.Paciente.enfermedades_cronicas,
            models.User.nombre,
            models.User.apellidos,
            models.User.email
        )
        .join(models.User, models.User.id == models.Paciente.id_usuario)
        .filter(models.Paciente.id_paciente == paciente_id)
        .first()
    )

    if not resultado:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")

    return resultado

@router.put("/pacientes/{paciente_id}", response_model=schemas.PacienteOut)
def actualizar_paciente(paciente_id: int, paciente: schemas.PacienteCreate, db: Session = db_dependency, current_user = user_dependency):
    return crud.update_paciente(db, paciente_id, paciente)

@router.delete("/pacientes/{paciente_id}")
def eliminar_paciente(paciente_id: int, db: Session = db_dependency, current_user = user_dependency):
    return crud.delete_paciente(db, paciente_id)
# pacientes.py ==============================================