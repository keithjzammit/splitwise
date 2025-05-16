from fastapi import APIRouter
from .endpoints.auth import router as auth_router
from .endpoints.groups import router as groups_router
from .endpoints.expenses import router as expenses_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(groups_router, prefix="/groups", tags=["groups"])
api_router.include_router(expenses_router, prefix="/expenses", tags=["expenses"])
