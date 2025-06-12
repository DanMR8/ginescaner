# // models.py ==========================================================================================================
from sqlalchemy import Column, Integer, String, Date, Text, Enum, ForeignKey, DateTime, DECIMAL
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True)
    clave = Column(String(100), nullable=False)
    tipo = Column(String(20), nullable=False)

    pacientes = relationship("Paciente", back_populates="usuario")
    medico = relationship("Medico", uselist=False, back_populates="usuario")

class Medico(Base):
    __tablename__ = "medicos"

    id = Column(Integer, primary_key=True, index=True)
    # id_usuario = Column(Integer, ForeignKey("users.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    # nombres = Column(String(100), nullable=False)
    # apellidos = Column(String(100), nullable=False)
    especialidad = Column(String(100), nullable=False)
    cedula = Column(String(50), nullable=False)
    institucion = Column(String(100), nullable=False)
    telefono = Column(String(20), nullable=False)
    # correo = Column(String(100), nullable=False)

    usuario = relationship("User", back_populates="medico")
    sesiones = relationship("Sesion", back_populates="medico")

class Paciente(Base):
    __tablename__ = "pacientes"

    id_paciente = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("users.id"), nullable=False)
    nombres = Column(String(100), nullable=False)
    apellidos = Column(String(100), nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    alergias = Column(Text)
    enfermedades_cronicas = Column(Text)
    contacto_emergencia = Column(String(100))
    telefono = Column(String(20), unique=True)
    correo = Column(String(100), unique=True)

    usuario = relationship("User", back_populates="pacientes")
    sesiones = relationship("Sesion", back_populates="paciente")

class Sesion(Base):
    __tablename__ = "sesiones"

    id_sesion = Column(Integer, primary_key=True, index=True)
    id_medico = Column(Integer, ForeignKey("medicos.id"), nullable=False)
    id_paciente = Column(Integer, ForeignKey("pacientes.id_paciente"), nullable=False)
    fecha = Column(DateTime, nullable=False)
    motivo = Column(Text, nullable=False)
    diagnostico_previo = Column(Text)
    peso = Column(DECIMAL(5, 2))
    intervenciones_previas = Column(Text)
    paridad = Column(Integer)
    etapa_reproductiva = Column(Enum('prepuber','fertil','menopausica','postmenopausica','otro'))
    tratamientos_anticonceptivos = Column(Text)
    plan = Column(Text)
    anotaciones = Column(Text)

    medico = relationship("Medico", back_populates="sesiones")
    paciente = relationship("Paciente", back_populates="sesiones")
    ultrasonidos = relationship("Ultrasonido", back_populates="sesion")

class Ultrasonido(Base):
    __tablename__ = "ultrasonidos"

    id_imagen = Column(Integer, primary_key=True, index=True)
    id_sesion = Column(Integer, ForeignKey("sesiones.id_sesion"), nullable=False)
    imagen = Column(String(255))  # O usar LargeBinary si guardas el binario
    path = Column(String(255), nullable=False)
    fecha = Column(DateTime, nullable=False)
    lesiones = Column(Text)
    descripcion = Column(Text)

    sesion = relationship("Sesion", back_populates="ultrasonidos")
# // models.py ==========================================================================================================
