from typing import Annotated

import fastapi
import sqlmodel

from app import database
from app import schemas

SessionDep = Annotated[sqlmodel.Session, fastapi.Depends(database.get_session)]

app = fastapi.FastAPI()


@app.on_event("startup")
def on_startup():
    database.create_db_and_tables()


@app.get("/idioms/")
def read_idioms(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, fastapi.Query(le=100)] = 100,
) -> list[schemas.Idiom]:
    return list(
        session.exec(sqlmodel.select(schemas.Idiom).offset(offset).limit(limit)).all()
    )
