from datetime import datetime
from enum import Enum
import uuid

from app.models.sensor_models import Sensor
from sqlmodel import Field, Relationship, SQLModel # type: ignore



class SensorClass(str, Enum):
    car = "car"
    motorcycle = "motorcycle"
    pedestrian = "pedestrian"
    bicycle = "bicycle"
    mobility_aid = "mobility_aid"


class Approach(str, Enum):
    NB = "NB"  # Northbound
    SB = "SB"  # Southbound
    WB = "WB"  # Westbound
    EB = "EB"  # Eastbound


class SensorData(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    sensor_id: uuid.UUID = Field(foreign_key="sensor.id", nullable=False)
    sensor: "Sensor" = Relationship()
    class_type: SensorClass = Field(sa_column_kwargs={"nullable": False})
    approach: Approach = Field(sa_column_kwargs={"nullable": False})
    time: datetime = Field()


class SensorDataPublic(SQLModel):
    sensor_id: uuid.UUID
    class_type: SensorClass
    approach: Approach
    time: datetime