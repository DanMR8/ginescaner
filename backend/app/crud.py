# // crud.py ==========================================================================================================
from sqlalchemy.orm import Session
from app import models, schemas
from passlib.context import CryptContext
from fastapi import HTTPException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.clave)
    db_user = models.User(
        nombre=user.nombre,
        apellidos=user.apellidos,    # ✅ nuevo campo
        email=user.email,
        clave=hashed_password,
        tipo=user.tipo,
        estatus=user.estatus
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # ⚠️ Esta parte queda pendiente para cuando se incluya perfil_medico desde el frontend
    return db_user

def create_medico(db: Session, medico: schemas.MedicoCreate):
    nuevo_medico = models.Medico(**medico.dict())
    db.add(nuevo_medico)
    db.commit()
    db.refresh(nuevo_medico)
    return nuevo_medico

def get_medico_by_user(db: Session, user_id: int):
    return db.query(models.Medico).filter(models.Medico.user_id == user_id).first()

def get_pacientes(db: Session):
    return db.query(models.Paciente).all()

def get_paciente(db: Session, paciente_id: int):
    return db.query(models.Paciente).filter(models.Paciente.id == paciente_id).first()

def create_paciente(db: Session, paciente: schemas.PacienteCreate):
    db_paciente = models.Paciente(**paciente.dict())  # ✅ usar directamente `paciente.dict()`
    db.add(db_paciente)
    db.commit()
    db.refresh(db_paciente)
    return db_paciente

def delete_paciente(db: Session, paciente_id: int):
    paciente = get_paciente(db, paciente_id)
    if paciente:
        db.delete(paciente)
        db.commit()
    return paciente

def update_paciente(db: Session, paciente_id: int, paciente_data: schemas.PacienteCreate):
    paciente = get_paciente(db, paciente_id)
    if paciente:
        for key, value in paciente_data.dict().items():
            setattr(paciente, key, value)
        db.commit()
        db.refresh(paciente)
    return paciente

def create_paciente_con_usuario(db: Session, data: schemas.PacienteRegistro):
    # 🛑 Validar email duplicado
    if get_user_by_email(db, data.email):
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    # 1. Crear usuario
    hashed_password = pwd_context.hash(data.clave or "paciente123")
    nuevo_usuario = models.User(
        nombre=data.nombre,
        apellidos=data.apellidos,
        email=data.email,
        clave=hashed_password,
        tipo="paciente",
        estatus="activo"
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    # 2. Crear paciente
    nuevo_paciente = models.Paciente(
        id_usuario=nuevo_usuario.id,
        fecha_nacimiento=data.fecha_nacimiento,
        telefono=data.telefono,
        contacto_emergencia=data.contacto_emergencia,
        alergias=data.alergias,
        enfermedades_cronicas=data.enfermedades_cronicas
    )
    db.add(nuevo_paciente)
    db.commit()
    db.refresh(nuevo_paciente)

    return nuevo_paciente


from app.models import EtapaReproductiva  # 👈 Asegúrate de importar el Enum

def create_sesion_con_medico(db: Session, sesion_data: schemas.SesionCreate, id_medico: int):
    nueva_sesion = models.Sesion(**sesion_data.dict(), id_medico=id_medico)
    db.add(nueva_sesion)
    db.commit()
    db.refresh(nueva_sesion)

    # ✅ Corregimos posible error de validación por serialización del Enum
    if isinstance(nueva_sesion.etapa_reproductiva, EtapaReproductiva):
        nueva_sesion.etapa_reproductiva = nueva_sesion.etapa_reproductiva.value

    return nueva_sesion

# // crud.py ==========================================================================================================