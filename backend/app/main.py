from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(
    title="GNSS Virtual Lab API",
    version="1.0.0"
)

app.include_router(router)

@app.get("/")
def root():
    return {
        "message": "GNSS Virtual Lab Backend Running"
    }