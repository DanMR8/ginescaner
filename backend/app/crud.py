from sqlalchemy.orm import Session
from app import models, schemas
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.contrasena)
    db_user = models.User(
        usuario=user.usuario,
        contrasena=hashed_password,
        tipo=user.tipo,
        estatus=user.estatus,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    if user.tipo == "medico" and user.perfil_medico:
        perfil = user.perfil_medico
        db_medico = models.Medico(
            id_usuario=db_user.id_usuario,
            nombres=perfil.nombres,
            apellidos=perfil.apellidos,
            especialidad=perfil.especialidad,
            cedula=perfil.cedula,
            institucion=perfil.institucion,
            telefono=perfil.telefono,
            correo=perfil.correo,
        )
        db.add(db_medico)
        db.commit()
        db.refresh(db_medico)

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
    db_paciente = models.Paciente(**paciente.dict())
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

# def create_sesion(db: Session, sesion: schemas.SesionCreate):
#     db_sesion = models.Sesion(**sesion.dict())
#     db.add(db_sesion)
#     db.commit()
#     db.refresh(db_sesion)
#     return db_sesion
