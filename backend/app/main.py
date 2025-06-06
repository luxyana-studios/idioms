from typing import Annotated
from uuid import UUID

from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import database
from app.models.idioms import IdiomModel
from app.schemas.idioms import IdiomCreate, IdiomSchema, IdiomUpdate

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
    page: int = 1,
    limit: Annotated[int, Query(le=50)] = 50,
    search: Annotated[str, Query()] = "",
) -> list[IdiomSchema]:
    search = search.strip()
    offset = (page - 1) * limit

    if not search:
        return [
            IdiomSchema.model_validate(idiom)
            for idiom in db.query(IdiomModel)
            .order_by(IdiomModel.text.asc())
            .limit(limit)
            .offset(offset)
            .all()
        ]
    else:
        return [
            IdiomSchema.model_validate(idiom)
            for idiom in db.query(IdiomModel)
            .filter(IdiomModel.text.ilike(f"%{search}%"))
            .order_by(IdiomModel.text.asc())
            .limit(limit)
            .offset(offset)
            .all()
        ]


@app.post("/idioms/")
def post_idioms(db: SessionDep, payload: list[IdiomCreate]) -> None:
    idioms = [IdiomModel(**idiom.model_dump()) for idiom in payload]
    db.add_all(idioms)
    db.commit()


@app.post("/idioms/{id}/upvote", response_model=IdiomSchema)
async def upvote_idiom(db: SessionDep, id: UUID) -> IdiomSchema:
    idiom = db.query(IdiomModel).filter(IdiomModel.id == id).first()
    if not idiom:
        raise HTTPException(status_code=404, detail="Idiom not found")

    idiom.upvotes += 1
    db.add(idiom)
    db.commit()
    db.refresh(idiom)
    return idiom


@app.post("/idioms/{id}/downvote", response_model=IdiomSchema)
async def downvote_idiom(db: SessionDep, id: UUID) -> IdiomSchema:
    idiom = db.query(IdiomModel).filter(IdiomModel.id == id).first()
    if not idiom:
        raise HTTPException(status_code=404, detail="Idiom not found")

    idiom.downvotes += 1
    db.add(idiom)
    db.commit()
    db.refresh(idiom)
    return idiom


@app.patch("/idioms/{id}", response_model=IdiomSchema)
async def update_idiom(db: SessionDep, id: UUID, payload: IdiomUpdate) -> IdiomSchema:
    idiom = db.query(IdiomModel).filter(IdiomModel.id == id).first()
    if not idiom:
        raise HTTPException(status_code=404, detail="Idiom not found")

    idiom_update = payload.model_dump(exclude_unset=True)
    for key, value in idiom_update.items():
        setattr(idiom, key, value)

    db.add(idiom)
    db.commit()
    db.refresh(idiom)
    return idiom
