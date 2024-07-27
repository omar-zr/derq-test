from itertools import groupby, product
import uuid
from typing import Any, List, Optional
from datetime import datetime
from pydantic import BaseModel

from app.models.sensor_data_models import Approach, SensorClass, SensorData, SensorDataPublic
from app.schema.sensor_data_schemas import ApproachData, HourlyApproachCount, HourlyData, SensorDataCreate, SensorDataPublicList
from fastapi import APIRouter, HTTPException, Query
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep

router = APIRouter()

@router.get("/", response_model=SensorDataPublicList)
def getSensorData(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
    class_type: Optional[str] = None,
    approach: Optional[str] = None,
    sensor_id: Optional[uuid.UUID] = None,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None
) -> Any:
    """
    Retrieve SensorData with optional filtering based on class_type, approach, sensor_id, and time range.
    """
    # ... (existing implementation)

@router.get("/counts", response_model=List[ApproachData])
def get_hourly_counts(
    session: SessionDep,
    start_date: datetime,
    end_date: datetime,
    sensor_id: Optional[uuid.UUID] = None,
    approach: Optional[str] = None,
    sensorclass: Optional[str] = None
) -> Any:
    """
    Returns detailed hourly counts for a specific date range, sensor, approach, and class.
    """
    # ... (existing implementation)

@router.post("/sensordata", response_model=SensorDataPublicList)
def create_sensor_data(
    sensor_data: List[SensorDataCreate],
    session: SessionDep
) -> SensorDataPublicList:
    """
    Receive sensor data and store it into the database.
    """
    # ... (existing implementation)