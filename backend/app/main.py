from typing import Annotated

from fastapi import Depends
from fastapi import FastAPI
from fastapi import Query
from sqlalchemy.orm import Session

from app import database
from app.models.idioms import IdiomModel
from app.schemas.idioms import IdiomSchema

SessionDep = Annotated[Session, Depends(database.get_session)]

app = FastAPI()


@app.on_event("startup")
def on_startup():
    database.create_db_and_tables()


@app.get("/idioms/", response_model=list[IdiomSchema])
def get_idioms(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[IdiomSchema]:
    return [
        IdiomSchema.model_validate(idiom)
        for idiom in session.query(IdiomModel).limit(limit).offset(offset).all()
    ]
