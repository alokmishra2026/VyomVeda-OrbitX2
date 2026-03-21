from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import random

app = FastAPI(title="VyomVeda ML Brain")

class TelemetryData(BaseModel):
    altitude: float
    speed: float
    battery: float

@app.get("/")
def read_root():
    return {"status": "ML Engine Online"}

@app.post("/predict")
def predict_anomaly(data: TelemetryData):
    # Simulate a Machine Learning model assessing orbital telemetry
    # This acts as the "Predictive analytics" ML model requested in the prompt
    
    # Calculate base risk based on deviations from ideal orbit (Alt: 408km, Speed: 7.66km/s)
    base_risk = 0.0
    
    if data.altitude < 400:
        base_risk += (400 - data.altitude) * 0.15
    elif data.altitude > 420:
        base_risk += (data.altitude - 420) * 0.05
        
    if data.speed < 7.6:
        base_risk += (7.6 - data.speed) * 20
    elif data.speed > 7.8:
        base_risk += (data.speed - 7.8) * 30
        
    if data.battery < 50:
        base_risk += (50 - data.battery) * 0.5
        
    # Introduce ML probabilistic noise simulating multi-factor environmental variance
    risk_score = min(max(base_risk + random.uniform(1.0, 12.0), 0.0), 100.0)
    
    status = "NOMINAL"
    if risk_score > 60:
        status = "CRITICAL"
    elif risk_score > 30:
        status = "WARNING"
        
    # Simulate Environmental Physics Modeling
    solar_flare_probability = round(random.uniform(0.1, 15.0), 2)
    debris_collision_risk = round(random.uniform(0.01, 5.0), 2)
    
    return {
        "ml_anomaly_score": round(risk_score, 2),
        "status": status,
        "solar_flare_probability": solar_flare_probability,
        "debris_collision_risk": debris_collision_risk,
        "ai_recommendation": "Adjust orbit immediately; deploy shielding." if status == "CRITICAL" else "All systems nominal."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
