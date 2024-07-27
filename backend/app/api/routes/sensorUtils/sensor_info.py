import uuid
from typing import List

from app.models.sensor_models import Sensor
from fastapi import APIRouter
from sqlmodel import select

from app.api.deps import SessionDep

router = APIRouter()

@router.get("/info", response_model=List[Sensor])
def get_sensors(session: SessionDep) -> List[Sensor]:
    """
    Retrieve a list of sensors from the database.
    """
    sensors = session.query(Sensor).all()
    return sensors