from datetime import datetime
from typing import Dict, Any
from app.state import state
from app.models import Incident, IncidentTimelineEvent, Indicator, LogEntry
from app.database import save_incident, save_log, save_simulation_record

def launch_ransomware_attack(target_id: str = "db-prod-04") -> Dict[str, Any]:
    """Launches simulated Ransomware attack."""
    asset = state.assets.get(target_id, state.assets["db-prod-04"])
    
    # 1. Modify telemetry
    asset.file_modifications = 14820
    asset.cpu_percent = 94.2
    asset.risk_score = 94
    asset.status = "Critical"
    state.active_simulation = "ransomware"
    state.security_score = 42
    
    # 2. Create Incident
    inc_id = f"INC-RW-{datetime.now().strftime('%M%S')}"
    incident = Incident(
        id=inc_id,
        title="Ransomware Encryption Vector (T1486)",
        description=f"Active cryptographic file modification detected on {asset.name}. High frequency I/O patterns match LockBit 3.0 / BlackCat signatures.",
        threat_type="Ransomware Attack (T1486)",
        mitre_id="T1486",
        severity="Critical",
        risk_score=94,
        confidence=98,
        affected_asset_id=asset.id,
        affected_asset_name=asset.name,
        affected_asset_ip=asset.ip,
        affected_asset_os=asset.os,
        affected_asset_owner=asset.owner,
        stage="detect",
        status="Active",
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        updated_at="Just now",
        indicators=[
            Indicator(
                id=f"ind-rw-1",
                type="File Hash (SHA256)",
                value="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                confidence="High",
                severity="Critical",
                details="Known BlackCat ransomware payload hash"
            ),
            Indicator(
                id=f"ind-rw-2",
                type="Process ID",
                value="PID 8912 (vssadmin.exe delete shadows /all /quiet)",
                confidence="High",
                severity="Critical",
                details="Volume shadow copy deletion command intercepted"
            ),
            Indicator(
                id=f"ind-rw-3",
                type="IP Address",
                value="185.220.101.5 (Tor Exit Node C2)",
                confidence="High",
                severity="Critical",
                details="Outbound command & control key exchange attempt"
            )
        ],
        timeline=[
            IncidentTimelineEvent(
                time=datetime.now().strftime("%H:%M:%S"),
                stage="Predict",
                title="AI Heuristic Anomaly",
                description="AI detected rapid entropy increase in file modification stream.",
                status="Completed"
            ),
            IncidentTimelineEvent(
                time=datetime.now().strftime("%H:%M:%S"),
                stage="Detect",
                title="Ransomware Binary Flagged",
                description="Signature matching confirmed T1486 encryption executable.",
                status="Active"
            ),
            IncidentTimelineEvent(
                time="Pending",
                stage="Contain",
                title="Containment Required",
                description="Immediate host isolation and VLAN disconnection recommended.",
                status="Pending"
            ),
            IncidentTimelineEvent(
                time="Pending",
                stage="Recover",
                title="Backup Restore & Quarantining",
                description="Restore database snapshot from verified immutable storage.",
                status="Pending"
            )
        ],
        response_actions=[
            f"Isolate {asset.name} from internal network",
            "Terminate malicious PID 8912 and associated worker threads",
            "Block C2 IP 185.220.101.5 at edge border router",
            "Trigger automated volume snapshot verification"
        ]
    )
    
    state.incidents[inc_id] = incident
    save_incident(incident.model_dump())
    
    # 3. Add to logs
    new_log = LogEntry(
        id=f"log-{datetime.now().timestamp()}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        source_ip=asset.ip,
        host_name=asset.name,
        activity_type="Ransomware Payload Execution",
        status="CRITICAL",
        details=f"Rapid encryption of 14,820 files on {asset.name}. Shadow copy deletion attempt.",
        action_available="Isolate"
    )
    state.logs.insert(0, new_log)
    save_log(new_log.model_dump())
    
    return {
        "success": True,
        "scenario": "Ransomware Attack",
        "affected_asset": asset.name,
        "incident_id": inc_id,
        "risk_score": asset.risk_score,
        "threat_level": "CRITICAL",
        "message": f"Ransomware simulation deployed on {asset.name}. Telemetry spiked and critical alert generated."
    }

def launch_bruteforce_attack(target_id: str = "comms-relay") -> Dict[str, Any]:
    """Launches simulated Brute Force attack."""
    asset = state.assets.get(target_id, state.assets["comms-relay"])
    
    asset.failed_logins = 1850
    asset.cpu_percent = 78.5
    asset.risk_score = 78
    asset.status = "Warning"
    state.active_simulation = "bruteforce"
    
    inc_id = f"INC-BF-{datetime.now().strftime('%M%S')}"
    incident = Incident(
        id=inc_id,
        title="Credential Access / Brute Force Surge (T1110)",
        description=f"Mass authentication failure storm on {asset.name}. Over 1,850 invalid password attempts from rotating external botnet nodes.",
        threat_type="Brute Force Entry (T1110)",
        mitre_id="T1110",
        severity="High",
        risk_score=78,
        confidence=92,
        affected_asset_id=asset.id,
        affected_asset_name=asset.name,
        affected_asset_ip=asset.ip,
        affected_asset_os=asset.os,
        affected_asset_owner=asset.owner,
        stage="detect",
        status="Active",
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        updated_at="Just now",
        indicators=[
            Indicator(
                id="ind-bf-1",
                type="IP Address",
                value="192.168.2.50 / Distributed Proxy Nodes",
                confidence="High",
                severity="Warning",
                details="Over 40 distinct IP sources conducting password spraying"
            )
        ],
        timeline=[
            IncidentTimelineEvent(
                time=datetime.now().strftime("%H:%M:%S"),
                stage="Predict",
                title="Auth Threshold Warning",
                description="Elevated login attempts detected on SSH/RADIUS gateway.",
                status="Completed"
            ),
            IncidentTimelineEvent(
                time=datetime.now().strftime("%H:%M:%S"),
                stage="Detect",
                title="Brute Force Signature Confirmed",
                description="Rate exceeded 500 attempts/sec with dictionary wordlists.",
                status="Active"
            ),
            IncidentTimelineEvent(
                time="Pending",
                stage="Contain",
                title="IP Lockout & Rate Limiting",
                description="Apply temporary IP ban rules and enforce MFA challenge.",
                status="Pending"
            ),
            IncidentTimelineEvent(
                time="Pending",
                stage="Recover",
                title="Credential Audit",
                description="Audit compromised accounts and force rotation.",
                status="Pending"
            )
        ],
        response_actions=[
            "Enable dynamic CAPTCHA and rate limiting on gateway",
            "Force credential reset on targeted administrator accounts",
            "Block proxy subnet 192.168.2.0/24"
        ]
    )
    state.incidents[inc_id] = incident
    
    state.logs.insert(0, LogEntry(
        id=f"log-{datetime.now().timestamp()}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        source_ip=asset.ip,
        host_name=asset.name,
        activity_type="Brute Force Authentication Storm",
        status="WARNING",
        details="1,850 failed login attempts in 60 seconds against admin portal.",
        action_available="Block IP"
    ))
    
    return {
        "success": True,
        "scenario": "Brute Force Attack",
        "affected_asset": asset.name,
        "incident_id": inc_id,
        "risk_score": asset.risk_score,
        "threat_level": "HIGH"
    }

def launch_exfiltration_attack(target_id: str = "db-prod-04") -> Dict[str, Any]:
    """Launches simulated Data Exfiltration attack."""
    asset = state.assets.get(target_id, state.assets["db-prod-04"])
    
    asset.network_traffic_mbps = 1450.0
    asset.risk_score = 88
    asset.status = "Critical"
    state.active_simulation = "exfiltration"
    
    inc_id = f"INC-EX-{datetime.now().strftime('%M%S')}"
    incident = Incident(
        id=inc_id,
        title="Anomalous High-Volume Data Exfiltration (T1048)",
        description=f"Unauthorized bulk data extraction from {asset.name}. Over 5.4 GB outbound transfer to unknown cloud storage provider.",
        threat_type="Data Exfiltration (T1048)",
        mitre_id="T1048",
        severity="Critical",
        risk_score=88,
        confidence=95,
        affected_asset_id=asset.id,
        affected_asset_name=asset.name,
        affected_asset_ip=asset.ip,
        affected_asset_os=asset.os,
        affected_asset_owner=asset.owner,
        stage="detect",
        status="Active",
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        updated_at="Just now",
        indicators=[
            Indicator(
                id="ind-ex-1",
                type="IP Address",
                value="198.51.100.44 (External Drop Server)",
                confidence="High",
                severity="Critical",
                details="Unencrypted data outbound egress over port 8443"
            )
        ],
        timeline=[
            IncidentTimelineEvent(
                time=datetime.now().strftime("%H:%M:%S"),
                stage="Predict",
                title="Traffic Anomaly Detected",
                description="Network telemetry flagged 15x baseline database egress.",
                status="Completed"
            ),
            IncidentTimelineEvent(
                time=datetime.now().strftime("%H:%M:%S"),
                stage="Detect",
                title="Exfiltration Intercepted",
                description="DPI confirmed sensitive table archive in payload.",
                status="Active"
            ),
            IncidentTimelineEvent(
                time="Pending",
                stage="Contain",
                title="Socket Termination",
                description="Sever active TCP sessions and quarantine egress route.",
                status="Pending"
            ),
            IncidentTimelineEvent(
                time="Pending",
                stage="Recover",
                title="Data Integrity Audit",
                description="Verify database checksums and audit accessed tables.",
                status="Pending"
            )
        ],
        response_actions=[
            "Drop active TCP session to 198.51.100.44",
            "Revoke export permissions on data engine service",
            "Quarantine database network segment"
        ]
    )
    state.incidents[inc_id] = incident
    
    state.logs.insert(0, LogEntry(
        id=f"log-{datetime.now().timestamp()}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        source_ip=asset.ip,
        host_name=asset.name,
        activity_type="Large Data Export (>5GB)",
        status="CRITICAL",
        details="High speed outbound transfer of confidential customer shards to external IP.",
        action_available="Isolate"
    ))
    
    return {
        "success": True,
        "scenario": "Data Exfiltration",
        "affected_asset": asset.name,
        "incident_id": inc_id,
        "risk_score": asset.risk_score,
        "threat_level": "CRITICAL"
    }

def launch_intrusion_attack(target_id: str = "wtr-scada-42") -> Dict[str, Any]:
    """Launches simulated Network Intrusion / SCADA manipulation attack."""
    asset = state.assets.get(target_id, state.assets["wtr-scada-42"])
    
    asset.cpu_percent = 88.0
    asset.network_traffic_mbps = 920.0
    asset.risk_score = 85
    asset.status = "Critical"
    state.active_simulation = "intrusion"
    
    inc_id = f"INC-SCADA-{datetime.now().strftime('%M%S')}"
    incident = Incident(
        id=inc_id,
        title="SCADA Controller Network Intrusion (T1498)",
        description=f"Industrial control protocol anomaly detected on {asset.name}. Unauthorized Modbus/DNP3 commands sent to water valve PLCs.",
        threat_type="Network Intrusion / SCADA",
        mitre_id="T1498",
        severity="Critical",
        risk_score=85,
        confidence=91,
        affected_asset_id=asset.id,
        affected_asset_name=asset.name,
        affected_asset_ip=asset.ip,
        affected_asset_os=asset.os,
        affected_asset_owner=asset.owner,
        stage="detect",
        status="Active",
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        updated_at="Just now",
        indicators=[
            Indicator(
                id="ind-scada-1",
                type="Network Port",
                value="TCP Port 502 (Modbus Protocol Injection)",
                confidence="High",
                severity="Critical",
                details="Malformed setpoint command packets received"
            )
        ],
        timeline=[
            IncidentTimelineEvent(
                time=datetime.now().strftime("%H:%M:%S"),
                stage="Predict",
                title="SCADA Protocol Deviation",
                description="Valve control packet frequency exceeded safety bounds.",
                status="Completed"
            ),
            IncidentTimelineEvent(
                time=datetime.now().strftime("%H:%M:%S"),
                stage="Detect",
                title="Intrusion Confirmed",
                description="Deep ICS inspection flagged unauthorized command sequence.",
                status="Active"
            ),
            IncidentTimelineEvent(
                time="Pending",
                stage="Contain",
                title="Failover to Manual Mode",
                description="Isolate PLC and activate physical override safeguards.",
                status="Pending"
            ),
            IncidentTimelineEvent(
                time="Pending",
                stage="Recover",
                title="PLC Firmware Verification",
                description="Verify ladder logic checksums and reset controller state.",
                status="Pending"
            )
        ],
        response_actions=[
            "Switch Water SCADA PLC to Isolated Offline Mode",
            "Block incoming Modbus packets from untrusted bridge",
            "Engage redundant backup pump controller"
        ]
    )
    state.incidents[inc_id] = incident
    
    state.logs.insert(0, LogEntry(
        id=f"log-{datetime.now().timestamp()}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        source_ip=asset.ip,
        host_name=asset.name,
        activity_type="SCADA Protocol Injection",
        status="CRITICAL",
        details="Malformed valve override command sent to water distribution controller.",
        action_available="Isolate"
    ))
    
    return {
        "success": True,
        "scenario": "Network Intrusion / SCADA",
        "affected_asset": asset.name,
        "incident_id": inc_id,
        "risk_score": asset.risk_score,
        "threat_level": "CRITICAL"
    }

def contain_asset(device_id: str) -> Dict[str, Any]:
    """Contains an asset by isolating it from the network grid."""
    asset = state.assets.get(device_id)
    if not asset:
        return {"success": False, "error": f"Asset {device_id} not found"}
        
    asset.status = "Isolated"
    asset.network_traffic_mbps = 0.0
    asset.risk_score = min(25, asset.risk_score)
    
    # Advance associated incidents to 'contain' stage
    for inc in state.incidents.values():
        if inc.affected_asset_id == device_id or device_id in inc.id.lower():
            inc.stage = "contain"
            inc.status = "Contained"
            for ev in inc.timeline:
                if ev.stage == "Contain":
                    ev.status = "Completed"
                    ev.time = datetime.now().strftime("%H:%M:%S")
                elif ev.stage == "Recover":
                    ev.status = "Active"
                    ev.time = "Ready"
                    
    new_log = LogEntry(
        id=f"log-{datetime.now().timestamp()}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        source_ip=asset.ip,
        host_name=asset.name,
        activity_type="Asset Isolation (Automatic Containment)",
        status="CONTAINED",
        details=f"{asset.name} ({asset.ip}) successfully quarantined from network mesh.",
        action_available=None
    )
    state.logs.insert(0, new_log)
    save_log(new_log.model_dump())
    
    # Add to simulation history
    sim_rec = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "scenario": f"Threat Contained ({asset.name})",
        "target": asset.name,
        "duration": "01m 20s",
        "outcome": "Defended"
    }
    state.simulation_history.insert(0, sim_rec)
    save_simulation_record(sim_rec)
    
    return {
        "success": True,
        "device_id": device_id,
        "status": "Isolated",
        "message": f"Asset {asset.name} has been isolated. Threat contained."
    }

def recover_asset(device_id: str) -> Dict[str, Any]:
    """Executes recovery sequence for an asset."""
    asset = state.assets.get(device_id)
    if not asset:
        return {"success": False, "error": f"Asset {device_id} not found"}
        
    asset.status = "Nominal"
    asset.risk_score = 12
    asset.cpu_percent = 28.5
    asset.network_traffic_mbps = 45.0
    asset.failed_logins = 0
    asset.file_modifications = 1200
    state.security_score = 94
    state.active_simulation = None
    
    # Update incident to Recovered
    for inc in state.incidents.values():
        if inc.affected_asset_id == device_id or device_id in inc.id.lower():
            inc.stage = "recover"
            inc.status = "Recovered"
            for ev in inc.timeline:
                if ev.stage == "Recover":
                    ev.status = "Completed"
                    ev.time = datetime.now().strftime("%H:%M:%S")
                    
    # Update recovery tasks
    for task in state.recovery_tasks:
        task.progress_percent = 100
        task.status = "completed"
        task.eta = "0s"
        
    new_log = LogEntry(
        id=f"log-{datetime.now().timestamp()}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        source_ip=asset.ip,
        host_name=asset.name,
        activity_type="System Recovery Completed",
        status="INFO",
        details=f"Backup verification, malware removal, and service restoration complete for {asset.name}.",
        action_available=None
    )
    state.logs.insert(0, new_log)
    save_log(new_log.model_dump())
    
    return {
        "success": True,
        "device_id": device_id,
        "status": "Nominal",
        "risk_score": 12,
        "message": f"System restoration completed for {asset.name}. Status returned to Healthy / Nominal."
    }

def recover_all_systems() -> Dict[str, Any]:
    """Master recovery for all affected assets and incidents."""
    for asset in state.assets.values():
        asset.status = "Nominal"
        asset.risk_score = 12
        asset.cpu_percent = 25.0
        asset.network_traffic_mbps = 50.0
        asset.failed_logins = 0
        asset.file_modifications = 1200
        
    for inc in state.incidents.values():
        inc.stage = "recover"
        inc.status = "Recovered"
        for ev in inc.timeline:
            ev.status = "Completed"
            if ev.time == "Pending" or ev.time == "Ready":
                ev.time = datetime.now().strftime("%H:%M:%S")
        save_incident(inc.model_dump())
                
    for task in state.recovery_tasks:
        task.progress_percent = 100
        task.status = "completed"
        task.eta = "0s"
        
    state.security_score = 96
    state.active_simulation = None
    
    new_log = LogEntry(
        id=f"log-{datetime.now().timestamp()}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        source_ip="0.0.0.0",
        host_name="MASTER-SOC",
        activity_type="Master Recovery Playbook Executed",
        status="INFO",
        details="All infrastructure assets restored from immutable snapshots. Risk normalized.",
        action_available=None
    )
    state.logs.insert(0, new_log)
    save_log(new_log.model_dump())
    
    return {
        "success": True,
        "security_score": 96,
        "message": "Master Recovery Completed. All critical infrastructure systems verified Nominal."
    }
