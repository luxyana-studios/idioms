from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import database
from app.models.users import UserModel
from app.schemas.users import UserCreate, UserSchema

SessionDep = Annotated[Session, Depends(database.get_session)]

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register", response_model=UserSchema)
async def post_idioms(db: SessionDep, user: UserCreate) -> None:
    user = UserModel(**user.model_dump())
    db.add(user)
    db.commit()

    return user
