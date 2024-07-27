from datetime import datetime
from typing import List
import uuid

from pydantic import BaseModel

from app.models.sensor_health_models import SensorHealthPublic
from sqlmodel import  SQLModel # type: ignore


class SensorHealthPublicList(SQLModel):
    data: List[SensorHealthPublic]
    count: int


class GapDetails(BaseModel):
    startTime: datetime
    endTime: datetime
    duration: str


class SensorHealthCreate(BaseModel):
    sensor_id: uuid.UUID
    time: datetime
    dcp: int
    online: bool
    fault: bool