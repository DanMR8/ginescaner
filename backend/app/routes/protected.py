from fastapi import APIRouter, Depends
from app import auth, schemas

router = APIRouter()

@router.get("/perfil", response_model=schemas.UserOut)
def read_profile(current_user: schemas.UserOut = Depends(auth.get_current_user)):
    return current_user
