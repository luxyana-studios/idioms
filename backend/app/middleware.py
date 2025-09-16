from collections.abc import Callable

from fastapi import HTTPException, Request, Response, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import sessionmaker
from starlette.middleware.base import BaseHTTPMiddleware

from app.database import engine
from app.models.users import UserModel


def get_current_user(request: Request) -> UserModel:
    if not hasattr(request.state, "user"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authenticated"
        )
    return request.state.user


class APIKeyMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, exempt_paths: list[str] | None = None):
        super().__init__(app)
        self.exempt_paths = exempt_paths or [
            "/",
            "/docs",
            "/openapi.json",
            "/redoc",
            "/users/register",
        ]
        self.session_factory = sessionmaker(bind=engine)

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if any(request.url.path.startswith(path) for path in self.exempt_paths):
            return await call_next(request)

        api_key = request.headers.get("x-api-key")

        if not api_key:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Unauthorized"},
            )

        with self.session_factory() as db:
            user = db.query(UserModel).filter(UserModel.api_key == api_key).first()

            if not user:
                return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"detail": "Unauthorized"},
                )

        request.state.user = user
        request.state.api_key = api_key

        return await call_next(request)
