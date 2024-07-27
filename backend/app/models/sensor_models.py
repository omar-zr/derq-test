import uuid
from typing import Optional

from sqlmodel import Field, SQLModel


class Sensor(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(max_length=255)
    location: str = Field(max_length=255)
    manufacture_id: Optional[str] = Field(default=None, max_length=255)
    note: Optional[str] = Field(default=None, max_length=255)


class SensorPublic(SQLModel):
    id: uuid.UUID
    name: str
    location: str
    manufacture_id: Optional[str]
    note: Optional[str]