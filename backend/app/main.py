from fastapi import FastAPI

from app.api.education import router as education_router
from app.api.visibility import router as visibility_router

app = FastAPI(
    title="GNSS Virtual Lab"
)

app.include_router(education_router)
app.include_router(visibility_router)


@app.get("/")
def home():
    return {
        "message": "GNSS Virtual Lab Backend Running"
    }