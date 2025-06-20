# imagenes.py==========================================================
from fastapi import APIRouter, UploadFile, File, Form, Depends, Body, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import shutil
import os
import uuid
from app import database, auth, models

router = APIRouter()
db_dependency = Depends(database.get_db)
get_medico = Depends(auth.get_current_user)

ORIGEN_DIR = "app/static/imagenes/originales"
PROCESADO_DIR = "app/static/imagenes/procesadas"

os.makedirs(ORIGEN_DIR, exist_ok=True)
os.makedirs(PROCESADO_DIR, exist_ok=True)

@router.post("/imagenes/analizar")
async def analizar_imagen_temporal(
    file: UploadFile = File(...),
):
    try:
        # ✅ Verificar que el tipo MIME sea imagen
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="El archivo no es una imagen válida")

        # ✅ Tomar extensión original (puede ser .bmp, .jpg, .png, etc.)
        extension = os.path.splitext(file.filename)[-1].lower()

        # 🔒 Validar extensiones potencialmente válidas
        extensiones_validas = [".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".gif", ".webp"]
        if extension not in extensiones_validas:
            raise HTTPException(status_code=400, detail=f"Formato no soportado: {extension}")

        # 🆔 Generar nombre único
        nombre_base = str(uuid.uuid4())
        nombre_archivo = f"{nombre_base}{extension}"
        ruta_origen = os.path.join(ORIGEN_DIR, nombre_archivo)

        # 💾 Guardar imagen original
        with open(ruta_origen, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 🔁 Simular análisis (luego se aplicará YOLO)
        nombre_procesada = f"{nombre_base}_proc{extension}"
        ruta_procesada = os.path.join(PROCESADO_DIR, nombre_procesada)
        shutil.copy(ruta_origen, ruta_procesada)

        return {
            "original": f"/{ruta_origen}",
            "procesada": f"/{ruta_procesada}",
            "nombre_original": nombre_archivo,
            "nombre_procesada": nombre_procesada
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno al analizar imagen: {str(e)}")

# imagenes.py==========================================================