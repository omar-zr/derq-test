from datetime import datetime
import uuid

from app.models.sensor_models import Sensor
from sqlmodel import Field, Relationship, SQLModel # type: ignore


class SensorHealth(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    sensor_id: uuid.UUID = Field(foreign_key="sensor.id", nullable=False)
    sensor: "Sensor" = Relationship()
    time: datetime = Field()
    dcp: int = Field(ge=0, le=100)
    online: bool
    fault: bool


class SensorHealthPublic(SQLModel):
    id: uuid.UUID
    sensor_id: uuid.UUID
    time: datetime
    dcp: int
    online: bool
    fault: bool