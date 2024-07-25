from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from app.generator import DataGenerator

app = FastAPI()

data_generator = DataGenerator(config={
    'counts_rate': 50,
    'approach_prob': [0.25, 0.25, 0.25, 0.25],
    'class_prob': [0.4, 0.2, 0.2, 0.2],
    'downtime_prob': 0.01,
    'base_url': 'http://backend/api/v1/sensors'
})

class GeneratorConfig(BaseModel):
    counts_rate: int
    approach_prob: list[float]
    class_prob: list[float]
    downtime_prob: float

@app.post("/start")
def start_generator(background_tasks: BackgroundTasks):
    background_tasks.add_task(data_generator.start)
    return {"status": "started"}

@app.post("/stop")
def stop_generator():
    data_generator.stop()
    return {"status": "stopped"}

@app.post("/configure")
def configure_generator(config: GeneratorConfig):
    data_generator.update_config(config.dict())
    return {"status": "configured"}

