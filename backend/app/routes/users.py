# // users.py ==========================================================================================================
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app import schemas, crud, auth, database
from app.auth import get_current_user
from app.models import User

router = APIRouter()

db_dependency = Depends(database.get_db)

@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = db_dependency):
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    return crud.create_user(db, user)

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = db_dependency):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")
    
    access_token = auth.create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "nombre": user.nombre,
            "apellidos": user.apellidos,
            "email": user.email,
            "tipo": user.tipo
        }
    }

@router.get("/users/me", response_model=schemas.UserOut)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
# // users.py ==========================================================================================================
