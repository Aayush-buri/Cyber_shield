from fastapi import APIRouter
from typing import Dict, Any, List
from app.state import state
from app.models import SimulationRequest
from app.simulator import (
    launch_ransomware_attack,
    launch_bruteforce_attack,
    launch_exfiltration_attack,
    launch_intrusion_attack
)

router = APIRouter(prefix="/api/simulate", tags=["simulation"])

@router.post("/ransomware")
def simulate_ransomware(req: SimulationRequest = SimulationRequest(scenario="ransomware")):
    target = req.target_asset_id or "db-prod-04"
    return launch_ransomware_attack(target)

@router.post("/bruteforce")
def simulate_bruteforce(req: SimulationRequest = SimulationRequest(scenario="bruteforce")):
    target = req.target_asset_id or "comms-relay"
    return launch_bruteforce_attack(target)

@router.post("/exfiltration")
def simulate_exfiltration(req: SimulationRequest = SimulationRequest(scenario="exfiltration")):
    target = req.target_asset_id or "db-prod-04"
    return launch_exfiltration_attack(target)

@router.post("/intrusion")
def simulate_intrusion(req: SimulationRequest = SimulationRequest(scenario="intrusion")):
    target = req.target_asset_id or "wtr-scada-42"
    return launch_intrusion_attack(target)

@router.post("/reset")
def reset_simulation():
    state.reset_to_default()
    return {
        "success": True,
        "message": "All virtual infrastructure assets reset to Nominal state. Security score restored to 84/100."
    }

@router.get("/history")
def get_simulation_history() -> List[Dict[str, Any]]:
    return state.simulation_history
