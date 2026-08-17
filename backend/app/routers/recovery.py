from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.state import state
from app.simulator import recover_asset, recover_all_systems

router = APIRouter(tags=["recovery"])

# Static endpoints MUST precede parameterized endpoints
@router.post("/api/recover/all")
@router.post("/api/recovery/all")
def recover_all():
    return recover_all_systems()

@router.get("/api/recover/status")
@router.get("/api/recovery/status")
def get_recovery_status() -> Dict[str, Any]:
    return {
        "tasks": state.recovery_tasks,
        "backup_health": [
            {"target": "Core_DB_Cluster", "last_snapshot": "12 mins ago", "integrity": "Verified"},
            {"target": "User_Auth_Logs", "last_snapshot": "1 hr ago", "integrity": "Verified"},
            {"target": "Edge_Configs_US", "last_snapshot": "4 hrs ago", "integrity": "Verified"},
            {"target": "SCADA_Ladder_Logic", "last_snapshot": "30 mins ago", "integrity": "Verified"}
        ],
        "playbooks": [
            {"id": "SOP-RW-01", "name": "Ransomware Isolate", "status": "Available"},
            {"id": "SOP-DD-04", "name": "DDoS Mitigation", "status": "Available"},
            {"id": "SOP-EX-02", "name": "Data Exfil Halt", "status": "Available"},
            {"id": "SOP-FO-01", "name": "Failover Execution", "status": "Active"}
        ]
    }

# Parameterized endpoint
@router.post("/api/recover/{device_id}")
@router.post("/api/recovery/{device_id}")
def recover_device(device_id: str):
    return recover_asset(device_id)
