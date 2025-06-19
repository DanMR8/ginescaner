# // schemas.py ==========================================================================================================
from pydantic import BaseModel, EmailStr,conint
from datetime import datetime, date
from typing import Optional, Union
from app.models import EtapaReproductiva 

class MedicoBase(BaseModel):
    especialidad: str
    cedula: str
    institucion: str
    telefono: str

class MedicoCreate(MedicoBase):
    user_id: int

class MedicoOut(MedicoBase):
    id: int

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    nombre: str
    apellidos: str
    email: str
    clave: str
    tipo: str = "medico"
    estatus: str = "activo"

class UserOut(BaseModel):
    id: int
    nombre: str
    tipo: str

    class Config:
        from_attributes = True

class PacienteCreate(BaseModel):
    nombre: str
    edad: int
    diagnostico: str = ""

class PacienteOut(BaseModel):
    id_paciente: int
    id_usuario: int
    fecha_nacimiento: date
    telefono: Optional[str]
    contacto_emergencia: Optional[str]
    alergias: Optional[str]
    enfermedades_cronicas: Optional[str]

    class Config:
        from_attributes = True

class PacienteConUsuario(BaseModel):
    id_paciente: int
    id_usuario: int
    fecha_nacimiento: date
    telefono: Optional[str]
    contacto_emergencia: Optional[str]
    alergias: Optional[str]
    enfermedades_cronicas: Optional[str]
    
    # Datos del usuario relacionados
    nombre: str
    apellidos: str
    email: EmailStr

    class Config:
        from_attributes = True

class SesionCreate(BaseModel):
    id_paciente: int
    fecha: datetime
    motivo: str
    diagnostico_previo: Optional[str] = None
    peso: Optional[float] = None
    intervenciones_previas: Optional[str] = None
    paridad: Optional[int] = None
    # etapa_reproductiva: Optional[conint(ge=0, le=4)] = None
    etapa_reproductiva: Optional[EtapaReproductiva] = None
    tratamientos_anticonceptivos: Optional[str] = None
    plan: Optional[str] = None
    anotaciones: Optional[str] = None

# class SesionOut(SesionCreate):
#     id_sesion: int
#     id_medico: int

#     class Config:
#         from_attributes = True
class SesionOut(SesionCreate):
    id_sesion: int
    id_medico: int
    # etapa_reproductiva: Optional[int] = None  # 👈 fuerza que sea int
    # etapa_reproductiva: Optional[Union[int, str]] = None
    class Config:
        from_attributes = True
        use_enum_values = True  # 👈 fuerza que Enum se convierta en número


class PacienteRegistro(BaseModel):
    # Datos del usuario
    nombre: str
    apellidos: str
    email: EmailStr
    clave: Optional[str] = "paciente123"

    # Datos clínicos
    fecha_nacimiento: date
    telefono: Optional[str]
    contacto_emergencia: Optional[str]
    alergias: Optional[str]
    enfermedades_cronicas: Optional[str]

    class Config:
        from_attributes = True

# // schemas.py ==========================================================================================================