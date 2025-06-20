# // main.py ==========================================================================================================
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import users, protected, medicos, pacientes, sesiones, imagenes
from app.database import engine, Base
from fastapi.staticfiles import StaticFiles

# Crear tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

# Inicializar FastAPI
app = FastAPI()

# Configurar CORS (permite comunicación con el frontend en otro origen)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # más seguro que usar ["*"] en desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Registrar rutas
app.include_router(users.router)
app.include_router(protected.router)
app.include_router(medicos.router)
app.include_router(pacientes.router)
app.include_router(sesiones.router)
app.include_router(imagenes.router)
# // main.py ==========================================================================================================
