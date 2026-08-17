from fastapi import APIRouter
from typing import List
from app.models import Threat
from app.state import state
from app.risk_engine import evaluate_threat_predictions

router = APIRouter(prefix="/api/threats", tags=["threats"])

@router.get("", response_model=List[Threat])
def get_threat_predictions():
    return evaluate_threat_predictions(list(state.assets.values()))
