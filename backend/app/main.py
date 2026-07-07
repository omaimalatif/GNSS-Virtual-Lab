from fastapi import FastAPI

app = FastAPI(
    title="GNSS Virtual Lab API",
    version="0.1.0"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to the GNSS Virtual Lab API!"
    }