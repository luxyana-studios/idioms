from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import database
from app.middleware import APIKeyMiddleware
from app.routers import idioms, users

SessionDep = Annotated[Session, Depends(database.get_session)]


@asynccontextmanager
async def lifespan(_app: FastAPI):
    database.create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)
app.include_router(idioms.router)
app.include_router(users.router)

app.add_middleware(APIKeyMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def status():
    return {"status": "ok"}
