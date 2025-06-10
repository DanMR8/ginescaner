from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import users, protected, medicos, pacientes, sesiones, imagenes
from app.database import engine, Base
from app import models

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS (para permitir peticiones desde el frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(protected.router)
app.include_router(pacientes.router)
app.include_router(sesiones.router)
app.include_router(imagenes.router)
app.include_router(medicos.router)
