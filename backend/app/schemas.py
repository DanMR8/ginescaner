from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class MedicoCreate(BaseModel):
    nombres: str
    apellidos: str
    especialidad: str
    cedula: str
    institucion: str
    telefono: Optional[str] = None
    correo: Optional[EmailStr] = None

class UserCreate(BaseModel):
    usuario: str
    contrasena: str
    tipo: str = "medico"
    estatus: str = "activo"
    perfil_medico: Optional[MedicoCreate] = None

class UserOut(BaseModel):
    id_usuario: int
    usuario: str
    tipo: str
    estatus: str

    class Config:
        orm_mode = True

class PacienteCreate(BaseModel):
    nombre: str
    edad: int
    diagnostico: str = ""

class PacienteOut(PacienteCreate):
    id: int

    class Config:
        orm_mode = True

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
        orm_mode = True