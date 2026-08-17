from fastapi import APIRouter, HTTPException
from typing import List
from app.models import Asset
from app.state import state

router = APIRouter(prefix="/api/devices", tags=["devices"])

@router.get("", response_model=List[Asset])
def get_devices():
    return list(state.assets.values())

@router.get("/{device_id}", response_model=Asset)
def get_device(device_id: str):
    asset = state.assets.get(device_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Device not found")
    return asset
