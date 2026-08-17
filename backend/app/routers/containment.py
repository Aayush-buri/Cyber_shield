from fastapi import APIRouter
from app.models import ContainmentRequest
from app.simulator import contain_asset

router = APIRouter(prefix="/api/contain", tags=["containment"])

# Static endpoints MUST precede parameterized endpoints
@router.post("/action")
def execute_containment_action(req: ContainmentRequest):
    return contain_asset(req.device_id)

# Parameterized endpoint
@router.post("/{device_id}")
def contain_device(device_id: str):
    return contain_asset(device_id)
