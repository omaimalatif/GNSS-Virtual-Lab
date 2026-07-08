from fastapi import APIRouter

from app.services.visibility import compute_visibility

router = APIRouter(
    prefix="/visibility",
    tags=["Visibility"]
)


@router.get("/")
def get_visibility():
    return compute_visibility()