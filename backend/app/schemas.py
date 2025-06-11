# // schemas.py ==========================================================================================================
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class MedicoBase(BaseModel):
    nombres: str
    apellidos: str
    especialidad: str
    cedula: str
    institucion: str
    telefono: str
    correo: str

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
    # apellidos: str
    # email: str
    tipo: str

    class Config:
        from_attributes = True

class PacienteCreate(BaseModel):
    nombre: str
    edad: int
    diagnostico: str = ""

class PacienteOut(PacienteCreate):
    id: int

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
    etapa_reproductiva: Optional[str] = None
    tratamientos_anticonceptivos: Optional[str] = None
    plan: Optional[str] = None
    anotaciones: Optional[str] = None

class SesionOut(SesionCreate):
    id_sesion: int
    id_medico: int

    class Config:
        from_attributes = True

# // schemas.py ==========================================================================================================