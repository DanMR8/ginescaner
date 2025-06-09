
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth import get_current_user
from app import models
import os
import shutil
import uuid

router = APIRouter(prefix="/imagenes", tags=["imagenes"])

MEDIA_FOLDER = "media"
os.makedirs(MEDIA_FOLDER, exist_ok=True)

@router.post("/{id_sesion}")
def subir_imagen(
    id_sesion: int,
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    # Validar que la sesión pertenezca al médico
    sesion = db.query(models.Sesion).filter(models.Sesion.id == id_sesion).first()
    if not sesion or sesion.id_medico != user["id"]:
        raise HTTPException(status_code=403, detail="No autorizado")

    extension = archivo.filename.split(".")[-1]
    if extension.lower() not in ["jpg", "jpeg", "png"]:
        raise HTTPException(status_code=400, detail="Formato de archivo no válido")

    nombre_archivo = f"{uuid.uuid4()}.{extension}"
    carpeta_sesion = os.path.join(MEDIA_FOLDER, f"sesion_{id_sesion}")
    os.makedirs(carpeta_sesion, exist_ok=True)
    ruta_archivo = os.path.join(carpeta_sesion, nombre_archivo)

    with open(ruta_archivo, "wb") as buffer:
        shutil.copyfileobj(archivo.file, buffer)

    # Aquí iría el procesamiento con YOLO
    ruta_resultado = ruta_archivo.replace(f".{extension}", f"_resultado.jpg")
    shutil.copy(ruta_archivo, ruta_resultado)  # simular procesamiento

    nueva = models.Imagen(
        id_sesion=id_sesion,
        ruta=ruta_archivo,
        ruta_resultado=ruta_resultado
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)

    return {"id": nueva.id, "ruta": nueva.ruta, "resultado": nueva.ruta_resultado}


@router.get("/ver/{imagen_id}")
def ver_imagen(imagen_id: int, db: Session = Depends(get_db)):
    imagen = db.query(models.Imagen).filter(models.Imagen.id == imagen_id).first()
    if not imagen:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    return FileResponse(imagen.ruta_resultado)
