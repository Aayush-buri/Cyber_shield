from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class Asset(BaseModel):
    id: str
    name: str
    type: str  # Server, Database, Industrial PLC, SCADA, Gateway, Workstation, IoT
    ip: str
    status: str  # Nominal, Warning, Critical, Isolated, Recovering
    risk_score: int = Field(ge=0, le=100)
    cpu_percent: float
    memory_percent: float
    network_traffic_mbps: float
    failed_logins: int
    file_creations: int
    file_modifications: int
    zone: str  # Power Grid Network, Water Control Sys, Comms Relay, Core Cluster, Enterprise Workstations
    os: str
    owner: str
    last_activity: str

class Indicator(BaseModel):
    id: str
    type: str  # IP Address, File Hash (SHA256), Process ID, Network Port, Auth Failure
    value: str
    confidence: str  # High, Medium, Low
    severity: str    # Critical, Warning, Info
    details: Optional[str] = None

class Threat(BaseModel):
    id: str
    attack_type: str  # Ransomware Payload, DDoS Amplification, Insider Threat Exfil, Brute Force Entry, Port Scan
    mitre_id: str     # T1486, T1110, T1048, T1498, T1046
    ai_confidence: int # percentage 0-100
    risk_score: int   # 1-10 or 0-100
    affected_asset_id: str
    affected_asset_name: str
    affected_asset_ip: str
    status: str       # Active, Investigating, Mitigated, Contained
    detected_at: str
    description: str
    indicators: List[Indicator] = []

class IncidentTimelineEvent(BaseModel):
    time: str
    stage: str        # Predict, Detect, Contain, Recover
    title: str
    description: str
    status: str       # Completed, Active, Pending

class Incident(BaseModel):
    id: str
    title: str
    description: str
    threat_type: str
    mitre_id: str
    severity: str     # Critical, High, Medium, Low
    risk_score: int
    confidence: int
    affected_asset_id: str
    affected_asset_name: str
    affected_asset_ip: str
    affected_asset_os: str
    affected_asset_owner: str
    stage: str        # predict, detect, contain, recover
    status: str       # Active, Investigating, Contained, Recovered
    created_at: str
    updated_at: str
    indicators: List[Indicator] = []
    timeline: List[IncidentTimelineEvent] = []
    response_actions: List[str] = []

class TelemetrySnapshot(BaseModel):
    system_risk_score: int
    risk_level: str  # SAFE, WARNING, HIGH, CRITICAL
    active_threats_count: int
    monitored_devices_count: int
    contained_threats_count: int
    online_percentage: float
    failed_logins_count: int
    failed_logins_delta_percent: float
    egress_traffic_tbs: float
    ingress_traffic_tbs: float
    file_creations_count: int
    file_modifications_count: int
    cpu_cluster_load_percent: float
    memory_allocation_percent: float
    traffic_history: List[int] = []
    failed_logins_history: List[int] = []
    risk_history: List[int] = []
    last_updated: str

class LogEntry(BaseModel):
    id: str
    timestamp: str
    source_ip: str
    host_name: str
    activity_type: str
    status: str  # CRITICAL, WARNING, INFO, BLOCKED, CONTAINED
    details: str
    action_available: Optional[str] = None

class SimulationRequest(BaseModel):
    scenario: str  # ransomware, bruteforce, exfiltration, intrusion
    target_asset_id: Optional[str] = None

class ContainmentRequest(BaseModel):
    device_id: str
    action: str = "isolate"  # isolate, block_ip, reset_credentials, terminate_process

class RecoveryTask(BaseModel):
    id: str
    name: str
    target_asset_id: str
    progress_percent: int
    status: str  # pending, in_progress, completed
    eta: str
    details: str
