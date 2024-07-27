from typing import List

from pydantic import BaseModel

from app.models.sensor_models import SensorPublic
from sqlmodel import  SQLModel # type: ignore


class SensorsPublic(SQLModel):
    data: List[SensorPublic]
    count: int