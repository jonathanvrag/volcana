from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, constr
from typing import List

from app.db.sessions import get_db
from app.db import models
from app.deps.auth import get_current_user, require_role
from app.security import get_password_hash, verify_password


router = APIRouter(prefix="/users", tags=["Users"])


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str | None
    role: str
    is_active: bool

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str | None = None
    password: constr(min_length=6)
    role: str = "editor"
    is_active: bool = True


class ChangePasswordIn(BaseModel):
    current_password: constr(min_length=6)
    new_password: constr(min_length=6)


class UserUpdate(BaseModel):
    role: str | None = None
    is_active: bool | None = None


@router.get("/me", response_model=UserOut)
def read_current_user(
    current_user: models.User = Depends(get_current_user),
):
    return current_user


@router.get("/", response_model=List[UserOut])
def list_users(
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_role("admin")),
):
    return db.query(models.User).order_by(models.User.email).all()


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=UserOut)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_role("admin")),
):
    existing = (
        db.query(models.User)
        .filter(models.User.email == payload.email)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ya existe un usuario con ese correo",
        )

    user = models.User(
        email=payload.email,
        full_name=payload.full_name,
        password_hash=get_password_hash(payload.password),
        role=payload.role,
        is_active=payload.is_active,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(
    payload: ChangePasswordIn,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La contraseña actual no es correcta",
        )

    current_user.password_hash = get_password_hash(payload.new_password)
    db.add(current_user)
    db.commit()
    return


@router.patch("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_role("admin")),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado",
        )

    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(user, field, value)

    db.add(user)
    db.commit()
    db.refresh(user)
    return user
