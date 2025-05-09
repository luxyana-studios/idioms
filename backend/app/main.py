from typing import Annotated

from fastapi import Depends, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import database
from app.models.idioms import IdiomModel
from app.schemas.idioms import IdiomCreate, IdiomSchema

SessionDep = Annotated[Session, Depends(database.get_session)]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    database.create_db_and_tables()

@app.get("/idioms/", response_model=list[IdiomSchema])
def get_idioms(
    db: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[IdiomSchema]:
    return [
        IdiomSchema.model_validate(idiom)
        for idiom in db.query(IdiomModel).limit(limit).offset(offset).all()
    ]

@app.post("/idioms/")
def post_idioms(db: SessionDep, payload: list[IdiomCreate]) -> None:
    idioms = [IdiomModel(**idiom.model_dump()) for idiom in payload]
    db.add_all(idioms)
    db.commit()