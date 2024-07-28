import uuid
from typing import Any, List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel

from app.models.sensor_health_models import SensorHealth
from app.schema.sensor_health_schemas import GapDetails, SensorHealthCreate
from fastapi import APIRouter, HTTPException
from sqlmodel import select

from app.api.deps import SessionDep

router = APIRouter()

def format_duration(duration: timedelta) -> str:
    seconds = int(duration.total_seconds())
    periods = [
        ('hour', 3600),
        ('minute', 60),
        ('second', 1)
    ]
    
    parts = []
    for period_name, period_seconds in periods:
        if seconds >= period_seconds:
            period_value, seconds = divmod(seconds, period_seconds)
            parts.append(f"{period_value} {period_name}{'s' if period_value != 1 else ''}")
    
    return ', '.join(parts)

@router.get("/gaps", response_model=List[GapDetails])
def get_sensor_health_gaps(
    session: SessionDep,
    sensor_id: Optional[uuid.UUID] = None
) -> Any:
    """
    Returns gaps longer than 5 minutes between consecutive SensorHealth rows.
    Optionally filter by sensor_id.
    """
    # Fetch SensorHealth records ordered by time and optionally filter by sensor_id
    query = session.query(SensorHealth).order_by(SensorHealth.time)
    if sensor_id:
        query = query.filter(SensorHealth.sensor_id == sensor_id)
    sensor_health_records = query.all()

    gaps = []
    for i in range(1, len(sensor_health_records)):
        prev_record = sensor_health_records[i - 1]
        current_record = sensor_health_records[i]

        gap_duration = current_record.time - prev_record.time
        if gap_duration > timedelta(minutes=5):
            formatted_duration = format_duration(gap_duration)
            gaps.append(GapDetails(
                startTime=prev_record.time,
                endTime=current_record.time,
                duration=formatted_duration
            ))

    return gaps

@router.post("/", response_model=List[SensorHealthCreate])
def create_sensor_health(
    sensor_health_data: List[SensorHealthCreate],
    session: SessionDep
) -> List[SensorHealthCreate]:
    """
    Receive sensor health data and store it into the database.
    """

    # Convert Pydantic models to SQLAlchemy models
    sensor_health_objects = [
        SensorHealth(
            sensor_id=data.sensor_id,
            time=data.time,
            dcp=data.dcp,
            online=data.online,
            fault=data.fault
        )
        for data in sensor_health_data
    ]

    try:
        session.add_all(sensor_health_objects)
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

    # Convert stored objects to Pydantic models
    stored_data = [
        SensorHealthCreate(
            sensor_id=obj.sensor_id,
            time=obj.time,
            dcp=obj.dcp,
            online=obj.online,
            fault=obj.fault
        )
        for obj in sensor_health_objects
    ]

    return stored_data
