import pandas as pd
from app import crud
from sqlalchemy import create_engine
from sqlmodel import Session, select
from app.models import User, UserCreate, Sensor, SensorData, SensorHealth
from app.core.config import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the database engine
engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))

def init_db(session: Session) -> None:
    try:
        # Create the superuser if it does not exist
        user = session.exec(select(User).where(User.email == settings.FIRST_SUPERUSER)).first()
        if not user:
            user_in = UserCreate(
                email=settings.FIRST_SUPERUSER,
                password=settings.FIRST_SUPERUSER_PASSWORD,
                is_superuser=True,
            )
            user = crud.create_user(session=session, user_create=user_in)
            logger.info(f"Created superuser: {settings.FIRST_SUPERUSER}")

        # Seed sensors if not present
        if not session.exec(select(Sensor)).first():
            sensors = [
                Sensor(name="Sensor1", location="Location1", manufacture_id="0", note="Note1"),
                Sensor(name="Sensor2", location="Location2", manufacture_id="1", note="Note2"),
                Sensor(name="Sensor3", location="Location3", manufacture_id="2", note="Note3"),
                Sensor(name="Sensor4", location="Location4", manufacture_id="3", note="Note4"),
            ]
            session.add_all(sensors)
            session.commit()
            logger.info("Seeded sensors")

        # Seed SensorData from CSV file
        seed_sensor_data_from_csv('./app/core/seed_data/data_counts.csv', session)
        # logger.info("Seeded SensorData")

        # # Seed SensorHealth from CSV file
        seed_sensor_health_from_csv('./app/core/seed_data/data_system.csv', session)
        # logger.info("Seeded SensorHealth")

    except Exception as e:
        logger.error(f"An error occurred during initialization: {e}")
        session.rollback()

def seed_sensor_data_from_csv(csv_file_path: str, session: Session) -> None:
    try:
        df = pd.read_csv(csv_file_path)
        manufacture_id_to_sensor_id = {
            sensor.manufacture_id: sensor.id
            for sensor in session.exec(select(Sensor))
        }

        sensor_data_entries = []
        for _, row in df.iterrows():
            manufacture_id = row['sensor_id']
            sensor_id = manufacture_id_to_sensor_id.get(manufacture_id)
            if sensor_id is None:
                logger.warning(f"Sensor with manufacture_id '{manufacture_id}' not found in the database.")
                continue

            sensor_data_entries.append(
                SensorData(
                    time=pd.to_datetime(row['time']),
                    sensor_id=sensor_id,
                    class_type=row['class'],
                    approach=row['approach']
                )
            )

        session.add_all(sensor_data_entries)
        session.commit()
        logger.info(f"Inserted {len(sensor_data_entries)} records into SensorData")

    except Exception as e:
        logger.error(f"An error occurred while seeding SensorData: {e}")
        session.rollback()

def seed_sensor_health_from_csv(csv_file_path: str, session: Session) -> None:
    try:
        df = pd.read_csv(csv_file_path)
        manufacture_id_to_sensor_id = {
            sensor.manufacture_id: sensor.id
            for sensor in session.exec(select(Sensor))
        }

        sensor_health_entries = []
        for _, row in df.iterrows():
            manufacture_id = row['sensorId']
            sensor_id = manufacture_id_to_sensor_id.get(manufacture_id)
            if sensor_id is None:
                logger.warning(f"Sensor with manufacture_id '{manufacture_id}' not found in the database.")
                continue

            sensor_health_entries.append(
                SensorHealth(
                    time=pd.to_datetime(row['time']),
                    sensor_id=sensor_id,
                    dcp=row['dataCaptureRate'],
                    online=row['online'],
                    fault=row['fault']
                )
            )

        session.add_all(sensor_health_entries)
        session.commit()
        logger.info(f"Inserted {len(sensor_health_entries)} records into SensorHealth")

    except Exception as e:
        logger.error(f"An error occurred while seeding SensorHealth: {e}")
        session.rollback()
