from datetime import datetime
from typing import Dict, List
import uuid

from pydantic import BaseModel

from app.models.sensor_data_models import SensorDataPublic, SensorClass, Approach


class SensorDataPublicList(BaseModel):
    data: List[SensorDataPublic]
    count: int


class ApproachCount(BaseModel):
    approach: str
    count: int


class HourlyData(BaseModel):
    time: datetime
    count: int


class ApproachData(BaseModel):
    approach: str
    hours: List[HourlyData]


class DetailedHourlyCount(BaseModel):
    hour: datetime
    totalCount: int
    approaches: List[ApproachCount]


class DetailedApproachCount(BaseModel):
    approach: str
    count: int
    class_type: str


class HourlyApproachCount(BaseModel):
    hour: datetime
    totalCount: int
    results: Dict[str, int]

class MinuteApproachCount(BaseModel):
    minute: datetime
    totalCount: int
    results: Dict[str, int]



class SensorDataCreate(BaseModel):
    sensor_id: uuid.UUID
    class_type: str
    approach: str
    time: datetime