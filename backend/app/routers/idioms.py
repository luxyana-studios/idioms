from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy import text as sql_text
from sqlalchemy.orm import Session

from app import database
from app.models.idioms import IdiomModel
from app.schemas.idioms import IdiomCreate, IdiomSchema, IdiomUpdate

SessionDep = Annotated[Session, Depends(database.get_session)]

router = APIRouter(prefix="/idioms", tags=["idioms"])


@router.get("/", response_model=list[IdiomSchema])
async def get_idioms(
    db: SessionDep,
    page: int = 1,
    limit: Annotated[int, Query(le=50)] = 50,
    text: Annotated[str, Query()] = "",
) -> list[IdiomSchema]:
    text = text.strip()
    offset = (page - 1) * limit

    if not text:
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
            .filter(IdiomModel.text.ilike(f"%{text}%"))
            .order_by(IdiomModel.text.asc())
            .limit(limit)
            .offset(offset)
            .all()
        ]


@router.get("/random", response_model=list[IdiomSchema])
async def get_random_idioms(
    db: SessionDep,
    page: int = 1,
    limit: Annotated[int, Query(le=50)] = 50,
    seed: Annotated[int | None, Query()] = None,
) -> list[IdiomSchema]:
    offset = (page - 1) * limit
    if seed is not None:
        db.execute(sql_text(f"SELECT setseed({seed % 1000 / 1000.0})"))
    return [
        IdiomSchema.model_validate(idiom)
        for idiom in db.query(IdiomModel)
        .order_by(func.random())
        .limit(limit)
        .offset(offset)
        .all()
    ]


@router.get("/favorites", response_model=list[IdiomSchema])
async def get_favorite_idioms(
    db: SessionDep,
    page: int = 1,
    limit: Annotated[int, Query(le=50)] = 50,
) -> list[IdiomSchema]:
    offset = (page - 1) * limit

    return [
        IdiomSchema.model_validate(idiom)
        for idiom in db.query(IdiomModel)
        .filter(IdiomModel.favorite)
        .order_by(IdiomModel.text.asc())
        .limit(limit)
        .offset(offset)
        .all()
    ]


@router.post("/", status_code=201)
async def post_idioms(db: SessionDep, payload: list[IdiomCreate]) -> None:
    idioms = [IdiomModel(**idiom.model_dump()) for idiom in payload]
    db.add_all(idioms)
    db.commit()


@router.post("/{id}/upvote", response_model=IdiomSchema)
async def upvote_idiom(db: SessionDep, id: UUID) -> IdiomSchema:
    idiom = db.query(IdiomModel).filter(IdiomModel.id == id).first()
    if not idiom:
        raise HTTPException(status_code=404, detail="Idiom not found")
    idiom.upvotes += 1
    db.add(idiom)
    db.commit()
    db.refresh(idiom)
    return idiom


@router.post("/{id}/downvote", response_model=IdiomSchema)
async def downvote_idiom(db: SessionDep, id: UUID) -> IdiomSchema:
    idiom = db.query(IdiomModel).filter(IdiomModel.id == id).first()
    if not idiom:
        raise HTTPException(status_code=404, detail="Idiom not found")
    idiom.downvotes += 1
    db.add(idiom)
    db.commit()
    db.refresh(idiom)
    return idiom


@router.patch("/{id}", response_model=IdiomSchema)
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
