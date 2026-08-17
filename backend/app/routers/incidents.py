from fastapi import APIRouter, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from app.models import Incident
from app.state import state

router = APIRouter(prefix="/api/incidents", tags=["incidents"])

class IncidentUpdate(BaseModel):
    stage: Optional[str] = None
    status: Optional[str] = None

@router.get("", response_model=List[Incident])
def get_incidents():
    return list(state.incidents.values())

@router.get("/{incident_id}", response_model=Incident)
def get_incident(incident_id: str):
    inc = state.incidents.get(incident_id)
    if not inc:
        # Fallback to the first incident if available
        if state.incidents:
            return list(state.incidents.values())[0]
        raise HTTPException(status_code=404, detail="Incident not found")
    return inc

@router.patch("/{incident_id}", response_model=Incident)
def update_incident(incident_id: str, update: IncidentUpdate):
    inc = state.incidents.get(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    if update.stage:
        inc.stage = update.stage
    if update.status:
        inc.status = update.status
    return inc
