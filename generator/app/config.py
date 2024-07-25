from pydantic import BaseSettings

class Settings(BaseSettings):
    count_rate: int = 10
    vehicle_probability: float = 0.7
    pedestrian_probability: float = 0.2
    downtime_probability: float = 0.05
    traffic_pattern: str = "normal"

settings = Settings()
