from fastapi import APIRouter

from app.api.routes.sensorUtils.sensor_data import router as sensor_data_router
from app.api.routes.sensorUtils.sensor_health import router as sensor_health_router
from app.api.routes.sensorUtils.sensor_info import router as sensor_info_router

router = APIRouter()
router.include_router(sensor_data_router, prefix="/data", tags=["sensor-data"])
router.include_router(sensor_health_router, prefix="/health", tags=["sensor-health"])
router.include_router(sensor_info_router, prefix="/info", tags=["sensor-info"])