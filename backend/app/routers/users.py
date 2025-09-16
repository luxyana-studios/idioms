from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import database
from app.middleware import get_current_user
from app.models.users import UserModel
from app.schemas.users import UserCreate, UserSchema

SessionDep = Annotated[Session, Depends(database.get_session)]
CurrentUser = Annotated[UserModel, Depends(get_current_user)]

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register", response_model=UserSchema)
async def register_user(db: SessionDep, user: UserCreate) -> UserSchema:
    user_model = UserModel(**user.model_dump())
    db.add(user_model)
    db.commit()
    db.refresh(user_model)

    return user_model


@router.get("/me", response_model=UserSchema)
async def get_current_user_info(current_user: CurrentUser) -> UserSchema:
    return current_user
