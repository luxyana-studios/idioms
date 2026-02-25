from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app import database
from app.middleware import APIKeyMiddleware
from app.routers import idioms, users
from app.settings import app_settings

SessionDep = Annotated[Session, Depends(database.get_session)]


@asynccontextmanager
async def lifespan(_app: FastAPI):
    database.create_db_and_tables()
    yield


app = FastAPI(
    lifespan=lifespan,
    docs_url="/docs" if app_settings.debug_mode else None,
    redoc_url="/redoc" if app_settings.debug_mode else None,
    openapi_url="/openapi.json" if app_settings.debug_mode else None,
)
app.include_router(idioms.router)
app.include_router(users.router)

app.add_middleware(APIKeyMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=app_settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH"],
    allow_headers=["Content-Type", "Accept", "x-api-key"],
)


@app.get("/")
async def status():
    return {"status": "ok"}
