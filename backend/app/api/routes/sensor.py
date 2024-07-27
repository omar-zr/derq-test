from itertools import groupby, product
import uuid
from typing import Any, List, Optional
from datetime import datetime, timedelta

from pydantic import BaseModel

from app.models.sensor_data_models import Approach, SensorClass, SensorData, SensorDataPublic
from app.models.sensor_health_models import SensorHealth
from app.models.sensor_models import Sensor
from app.schema.sensor_data_schemas import ApproachData, HourlyApproachCount, HourlyData, SensorDataCreate, SensorDataPublicList
from app.schema.sensor_health_schemas import GapDetails, SensorHealthCreate
from fastapi import APIRouter, HTTPException, Query # type: ignore
from sqlmodel import func, select # type: ignore

from app.api.deps import CurrentUser, SessionDep

router = APIRouter()

# Response model for read_items
class HourlyCount(BaseModel):
    hour: datetime
    count: int 

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

    query = select(SensorData)
    
    # Apply filters
    if class_type:
        try:
            class_type_enum = SensorClass[class_type]
            query = query.where(SensorData.class_type == class_type_enum)
        except KeyError:
            raise HTTPException(status_code=400, detail="Invalid class_type value")

    if approach:
        try:
            approach_enum = Approach[approach]
            query = query.where(SensorData.approach == approach_enum)
        except KeyError:
            raise HTTPException(status_code=400, detail="Invalid approach value")

    if sensor_id:
        query = query.where(SensorData.sensor_id == sensor_id)
    
    if start_time:
        query = query.where(SensorData.time >= start_time)
    
    if end_time:
        query = query.where(SensorData.time <= end_time)

    # Count query
    count_statement = select(func.count()).select_from(query.subquery())
    count = session.execute(count_statement).scalar()

    # Paginated query
    statement = query.offset(skip).limit(limit)
    sensor_data_records = session.execute(statement).all()

    # Convert to public model
    sensor_data_list = [
        SensorDataPublic(
            id=record.id,
            sensor_id=record.sensor_id,
            class_type=record.class_type,
            approach=record.approach,
            time=record.time,
            sensor_name=record.sensor.name
        )
        for record in sensor_data_records
    ]

    return SensorDataPublicList(data=sensor_data_list, count=count)

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

    # Define the hour truncation
    hour_trunc = func.date_trunc("hour", SensorData.time)

    # Base query
    query = select(
        hour_trunc.label("hour"),
        SensorData.approach,
        func.count(SensorData.id).label("count")
    ).select_from(SensorData).where(
        SensorData.time >= start_date,
        SensorData.time <= end_date
    )

    # Apply filters
    if sensor_id:
        query = query.where(SensorData.sensor_id == sensor_id)

    if approach:
        try:
            approach_enum = Approach[approach]
            query = query.where(SensorData.approach == approach_enum)
        except KeyError:
            raise HTTPException(status_code=400, detail="Invalid approach value")

    if sensorclass:
        try:
            sensorclass_enum = SensorClass[sensorclass]
            query = query.where(SensorData.class_type == sensorclass_enum)
        except KeyError:
            raise HTTPException(status_code=400, detail="Invalid sensorclass value")

    # Group by hour, approach.
    query = query.group_by(hour_trunc, SensorData.approach)
    query = query.order_by(hour_trunc)

    # Execute the query and fetch results
    results = session.execute(query).all()

    # Structure the response
    approach_dict = {}
    for result in results:
        hour, approach, count = result
        if approach not in approach_dict:
            approach_dict[approach] = []
        approach_dict[approach].append(HourlyData(time=hour, count=count))

    approach_list = [ApproachData(approach=approach, hours=hours) for approach, hours in approach_dict.items()]

    return approach_list



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


@router.get("/sensorhealth/gaps", response_model=List[GapDetails])
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



@router.get("/detailed_counts", response_model=List[HourlyApproachCount])
def get_detailed_hourly_counts(
    session: SessionDep,
    current_user: CurrentUser,
    start_date: datetime,
    end_date: datetime,
    sensor_id: Optional[uuid.UUID] = None,
    approach: Optional[str] = None,
    sensorclass: Optional[str] = None
) -> Any:
    """
    Returns detailed hourly counts for a specific date range, sensor, approach, and class.
    """

    # Define the hour truncation
    hour_trunc = func.date_trunc("hour", SensorData.time)

    # Base query
    query = select(
        hour_trunc.label("hour"),
        SensorData.approach,
        SensorData.class_type,
        func.count(SensorData.id).label("count")
    ).select_from(SensorData).where(
        SensorData.time >= start_date,
        SensorData.time <= end_date
    )

    # Apply filters
    if sensor_id:
        query = query.where(SensorData.sensor_id == sensor_id)

    if approach:
        try:
            approach_enum = Approach[approach]
            query = query.where(SensorData.approach == approach_enum)
        except KeyError:
            raise HTTPException(status_code=400, detail="Invalid approach value")

    if sensorclass:
        try:
            sensorclass_enum = SensorClass[sensorclass]
            query = query.where(SensorData.class_type == sensorclass_enum)
        except KeyError:
            raise HTTPException(status_code=400, detail="Invalid sensorclass value")

    # Group by hour, approach, and class_type
    query = query.group_by(hour_trunc, SensorData.approach, SensorData.class_type)
    query = query.order_by(hour_trunc)

    # Execute the query and fetch results
    results = session.execute(query).all()

    # All possible approach and class_type combinations
    all_combinations = {f"{a}_{c}": 0 for a, c in product(Approach, SensorClass)}

    # Structure the response
    hourly_counts = []
    for hour, hour_group in groupby(results, key=lambda x: x.hour):
        results_dict = all_combinations.copy()
        for result in hour_group:
            key = f"{result.approach}_{result.class_type}"
            results_dict[key] = result.count

        total_count = sum(results_dict.values())
        hourly_counts.append({
            "hour": hour,
            "totalCount": total_count,
            "results": results_dict
        })

    return hourly_counts



@router.post("/sensordata", response_model=SensorDataPublicList)
def create_sensor_data(
    sensor_data: List[SensorDataCreate],
    session: SessionDep
) -> SensorDataPublicList:
    """
    Receive sensor data and store it into the database.
    """

    # Convert Pydantic models to SQLAlchemy models
    sensor_data_objects = [
        SensorData(
            sensor_id=data.sensor_id,
            class_type=SensorClass[data.class_type],
            approach=Approach[data.approach],
            time=data.time
        )
        for data in sensor_data
    ]

    try:
        session.add_all(sensor_data_objects)
        session.commit()
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred: {e}")

    # Convert stored objects to Pydantic models
    stored_data = [
        SensorDataPublic(
            sensor_id=obj.sensor_id,
            class_type=obj.class_type.value,
            approach=obj.approach.value,
            time=obj.time
        )
        for obj in sensor_data_objects
    ]

    return SensorDataPublicList(data=stored_data, count=len(stored_data))


@router.post("/health", response_model=List[SensorHealthCreate])
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

from typing import List
#  List All Sensors
@router.get("/info", response_model=List[Sensor])
def get_sensors(session: SessionDep) -> List[Sensor]:
    """
    Retrieve a list of sensors from the database.
    """
    sensors = session.query(Sensor).all()
    return sensors
