from fastapi import APIRouter, HTTPException

from app.services.education_service import (
    get_all_topics,
    get_topic_by_id
)

router = APIRouter(prefix="/education", tags=["Education"])


@router.get("/topics")
def list_topics():
    return get_all_topics()


@router.get("/topics/{topic_id}")
def topic_details(topic_id: int):

    topic = get_topic_by_id(topic_id)

    if topic is None:
        raise HTTPException(
            status_code=404,
            detail="Topic not found"
        )

    return topic