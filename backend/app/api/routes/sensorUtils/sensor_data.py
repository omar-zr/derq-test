from itertools import groupby, product
import uuid
from typing import Any, List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel

from app.models.sensor_data_models import Approach, SensorClass, SensorData, SensorDataPublic
from app.schema.sensor_data_schemas import ApproachData, HourlyApproachCount, HourlyData, MinuteApproachCount, SensorDataCreate, SensorDataPublicList
from fastapi import APIRouter, HTTPException, Query # type: ignore
from sqlmodel import func, select # type: ignore

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

def downtime(session: SessionDep, sensor_id: uuid.UUID) -> int:
    """
    Checks if the sensor is up. Returns 0 if the sensor is up, otherwise returns -1.
    """
    # Implement your logic to check if the sensor is up
    # For example, you might have a table that tracks sensor status
    # Here, we assume a simple check based on a hypothetical SensorStatus table.

    return -1
    # from sqlalchemy import select
    # from models import SensorStatus  # Assuming you have a SensorStatus model

    # status_query = select(SensorStatus).where(SensorStatus.sensor_id == sensor_id)
    # status = session.execute(status_query).scalar()

    # if status and status.is_up:
    #     return 0
    # else:
    #     return -1

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

    # Check if there are no results
    if not results:
        if sensor_id:
            status = downtime(session, sensor_id)
            if status == 0:
                return []  # Sensor is up but no data
            else:
                return [-1]  # Sensor is down
        else:
            return []  # No sensor_id provided, so we can't check downtime

    # Generate a list of all hours within the date range
    all_hours = [start_date + timedelta(hours=i) for i in range((end_date - start_date).days * 23 + (end_date - start_date).seconds // 3600 + 1)]

    # Structure the response
    approach_dict = {}
    for result in results:
        hour, approach, count = result
        if approach not in approach_dict:
            approach_dict[approach] = {h: 0 for h in all_hours}
        approach_dict[approach][hour] = count

    approach_list = []
    for approach, hour_counts in approach_dict.items():
        hours = [HourlyData(time=hour, count=count) for hour, count in hour_counts.items()]
        approach_list.append(ApproachData(approach=approach, hours=hours))

    return approach_list


@router.get("/live", response_model=List[ApproachData])
def get_latest_hour_counts(
    session: SessionDep,
    sensor_id: Optional[uuid.UUID] = None,
    approach: Optional[str] = None,
    sensorclass: Optional[str] = None
) -> Any:
    """
    Returns detailed counts for the latest 1 hour, sensor, approach, and class.
    """

    # Define the current time and the start time for the latest 1 hour
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(hours=1)

    # Define the minute truncation
    minute_trunc = func.date_trunc("minute", SensorData.time)

    # Base query
    query = select(
        minute_trunc.label("minute"),
        SensorData.approach,
        func.count(SensorData.id).label("count")
    ).select_from(SensorData).where(
        SensorData.time >= start_time,
        SensorData.time <= end_time
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

    # Group by minute, approach.
    query = query.group_by(minute_trunc, SensorData.approach)
    query = query.order_by(minute_trunc)

    # Execute the query and fetch results
    results = session.execute(query).all()

    # Check if there are no results
    if not results:
        if sensor_id:
            status = downtime(session, sensor_id)
            if status == 0:
                return []  # Sensor is up but no data
            else:
                return [-1]  # Sensor is down
        else:
            return []  # No sensor_id provided, so we can't check downtime

    # Generate a list of all minutes within the latest 1 hour
    all_minutes = [start_time + timedelta(minutes=i) for i in range(60)]

    # Structure the response
    approach_dict = {}
    for result in results:
        minute, approach, count = result
        if approach not in approach_dict:
            approach_dict[approach] = {m: 0 for m in all_minutes}
        approach_dict[approach][minute] = count

    approach_list = []
    for approach, minute_counts in approach_dict.items():
        minutes = [HourlyData(time=minute, count=count) for minute, count in minute_counts.items()]
        approach_list.append(ApproachData(approach=approach, hours=minutes))

    return approach_list

@router.post("/", response_model=SensorDataPublicList)
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
    

@router.get("/live/detailed_counts", response_model=List[MinuteApproachCount])
def get_detailed_minute_counts(
    session: SessionDep,
    sensor_id: Optional[uuid.UUID] = None,
    approach: Optional[str] = None,
    sensorclass: Optional[str] = None
) -> Any:
    """
    Returns detailed minute counts for the last 30 minutes, filtered by sensor, approach, and class.
    """

    # Get the current time and calculate the start time (30 minutes ago)
    end_date = datetime.now()
    start_date = end_date - timedelta(minutes=30)

    # Define the minute truncation
    minute_trunc = func.date_trunc("minute", SensorData.time)

    # Base query
    query = select(
        minute_trunc.label("minute"),
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

    # Group by minute, approach, and class_type
    query = query.group_by(minute_trunc, SensorData.approach, SensorData.class_type)
    query = query.order_by(minute_trunc)

    # Execute the query and fetch results
    results = session.execute(query).all()

    # All possible approach and class_type combinations
    all_combinations = {f"{a}_{c}": 0 for a, c in product(Approach, SensorClass)}

    # Structure the response
    minute_counts = []
    for minute, minute_group in groupby(results, key=lambda x: x.minute):
        results_dict = all_combinations.copy()
        for result in minute_group:
            key = f"{result.approach}_{result.class_type}"
            results_dict[key] = result.count

        total_count = sum(results_dict.values())
        minute_counts.append({
            "minute": minute,
            "totalCount": total_count,
            "results": results_dict
        })

    return minute_counts