from pydantic import BaseModel


class Observation(BaseModel):
    latitude: float
    longitude: float
    altitude: float