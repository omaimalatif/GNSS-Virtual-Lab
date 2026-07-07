from fastapi import APIRouter

from app.models.observation import Observation
from app.services.processor import process_observation

router = APIRouter()


@router.post("/process")
def process(data: Observation):
    result = process_observation(data.model_dump())

    return result