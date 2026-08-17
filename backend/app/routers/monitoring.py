from fastapi import APIRouter
from app.models import TelemetrySnapshot
from app.state import state

router = APIRouter(prefix="/api/monitoring", tags=["monitoring"])

@router.get("", response_model=TelemetrySnapshot)
def get_monitoring_telemetry():
    return state.get_telemetry_snapshot()
