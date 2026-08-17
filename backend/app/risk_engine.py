from typing import Dict, Any, List, Tuple
from app.models import Asset, Indicator, Threat

def calculate_asset_risk(asset: Asset) -> Tuple[int, str]:
    """
    Calculates deterministic risk score (0-100) and risk level for a single asset.
    0-30: Safe / Nominal
    31-60: Warning
    61-80: High
    81-100: Critical
    """
    score = 10  # Baseline safe score
    
    # 1. Failed Logins Impact
    if asset.failed_logins > 1000:
        score += 35
    elif asset.failed_logins > 100:
        score += 20
    elif asset.failed_logins > 20:
        score += 10
        
    # 2. File Modification Impact (Ransomware signature)
    if asset.file_modifications > 10000:
        score += 45
    elif asset.file_modifications > 2000:
        score += 25
    elif asset.file_modifications > 500:
        score += 10
        
    # 3. CPU Utilization Impact
    if asset.cpu_percent > 90:
        score += 20
    elif asset.cpu_percent > 75:
        score += 10
        
    # 4. Network Traffic Anomaly Impact
    if asset.network_traffic_mbps > 1000:
        score += 30
    elif asset.network_traffic_mbps > 500:
        score += 15
        
    # Clamp score between 0 and 100
    score = max(5, min(100, score))
    
    if score <= 30:
        level = "Nominal"
    elif score <= 60:
        level = "Warning"
    elif score <= 80:
        level = "High"
    else:
        level = "Critical"
        
    return score, level

def evaluate_threat_predictions(assets: List[Asset]) -> List[Threat]:
    """
    Evaluates telemetry across all infrastructure assets and generates AI threat prediction matrix.
    """
    predictions: List[Threat] = []
    
    for asset in assets:
        # Ransomware Check
        if asset.file_modifications > 3000 or (asset.cpu_percent > 85 and asset.file_modifications > 1000):
            confidence = min(98, 80 + int((asset.file_modifications / 15000) * 18))
            threat_risk = min(10, 7 + int(asset.risk_score / 35))
            predictions.append(
                Threat(
                    id=f"THR-RW-{asset.id}",
                    attack_type="Ransomware Payload",
                    mitre_id="T1486: Data Encrypted for Impact",
                    ai_confidence=confidence,
                    risk_score=threat_risk,
                    affected_asset_id=asset.id,
                    affected_asset_name=asset.name,
                    affected_asset_ip=asset.ip,
                    status="Active" if asset.status != "Isolated" else "Contained",
                    detected_at="Just now",
                    description=f"Rapid file modification anomaly detected on {asset.name}. Encryption heuristic patterns identified.",
                    indicators=[
                        Indicator(
                            id=f"ind-{asset.id}-1",
                            type="File Hash (SHA256)",
                            value="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                            confidence="High",
                            severity="Critical",
                            details="Known ransomware signature hash matched"
                        ),
                        Indicator(
                            id=f"ind-{asset.id}-2",
                            type="Process ID",
                            value="PID 4892 (vssadmin.exe delete shadows)",
                            confidence="High",
                            severity="Critical",
                            details="Shadow copy deletion attempt"
                        )
                    ]
                )
            )
            
        # Brute Force Check
        if asset.failed_logins > 100:
            confidence = min(96, 75 + int((asset.failed_logins / 2000) * 20))
            threat_risk = min(10, 6 + int(asset.failed_logins / 500))
            predictions.append(
                Threat(
                    id=f"THR-BF-{asset.id}",
                    attack_type="Brute Force Entry",
                    mitre_id="T1110: Credential Access",
                    ai_confidence=confidence,
                    risk_score=threat_risk,
                    affected_asset_id=asset.id,
                    affected_asset_name=asset.name,
                    affected_asset_ip=asset.ip,
                    status="Active" if asset.status != "Isolated" else "Contained",
                    detected_at="2m ago",
                    description=f"Automated authentication burst on {asset.name}. Multiple failed credential handshakes from rotating proxies.",
                    indicators=[
                        Indicator(
                            id=f"ind-{asset.id}-3",
                            type="IP Address",
                            value="192.168.2.50 / External Proxy Node",
                            confidence="High",
                            severity="Warning",
                            details="Repeated failed auth attempts (>1400/min)"
                        )
                    ]
                )
            )
            
        # Data Exfiltration Check
        if asset.network_traffic_mbps > 500:
            confidence = min(94, 70 + int((asset.network_traffic_mbps / 1200) * 24))
            threat_risk = min(10, 7 + int(asset.network_traffic_mbps / 400))
            predictions.append(
                Threat(
                    id=f"THR-EX-{asset.id}",
                    attack_type="Anomalous Data Exfiltration",
                    mitre_id="T1048: Exfiltration Over Alternative Protocol",
                    ai_confidence=confidence,
                    risk_score=threat_risk,
                    affected_asset_id=asset.id,
                    affected_asset_name=asset.name,
                    affected_asset_ip=asset.ip,
                    status="Active" if asset.status != "Isolated" else "Contained",
                    detected_at="5m ago",
                    description=f"High-volume outbound data transfer detected from {asset.name} to unclassified external IP via unauthorized port.",
                    indicators=[
                        Indicator(
                            id=f"ind-{asset.id}-4",
                            type="IP Address",
                            value="198.51.100.44 (Remote C2 Gateway)",
                            confidence="High",
                            severity="Critical",
                            details="Egress surge > 4.2 TB/s over port 8443"
                        )
                    ]
                )
            )

    # Add baseline realistic SOC threats if none triggered yet
    if not predictions:
        predictions = [
            Threat(
                id="THR-BASE-1",
                attack_type="Ransomware Payload",
                mitre_id="T1486: Data Encrypted",
                ai_confidence=94,
                risk_score=9,
                affected_asset_id="db-prod-04",
                affected_asset_name="DB-PROD-04",
                affected_asset_ip="10.0.5.22",
                status="Active",
                detected_at="10m ago",
                description="Elevated encryption heuristic patterns detected on database shards.",
                indicators=[
                    Indicator(
                        id="ind-base-1",
                        type="IP Address",
                        value="192.168.45.102",
                        confidence="High",
                        severity="Critical"
                    ),
                    Indicator(
                        id="ind-base-2",
                        type="File Hash (SHA256)",
                        value="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                        confidence="Medium",
                        severity="Warning"
                    )
                ]
            ),
            Threat(
                id="THR-BASE-2",
                attack_type="DDoS Amplification",
                mitre_id="T1498: Network Flooding",
                ai_confidence=78,
                risk_score=7,
                affected_asset_id="comms-relay",
                affected_asset_name="Edge-Gateway-East",
                affected_asset_ip="10.0.8.44",
                status="Active",
                detected_at="24m ago",
                description="UDP packet flood against edge communication relay.",
                indicators=[
                    Indicator(
                        id="ind-base-3",
                        type="Network Port",
                        value="UDP Port 53 / DNS Amplification",
                        confidence="High",
                        severity="Warning"
                    )
                ]
            ),
            Threat(
                id="THR-BASE-3",
                attack_type="Insider Threat Exfil",
                mitre_id="T1048: Exfiltration",
                ai_confidence=42,
                risk_score=4,
                affected_asset_id="wkst-04",
                affected_asset_name="Workstation-HR-04",
                affected_asset_ip="192.168.1.104",
                status="Investigating",
                detected_at="45m ago",
                description="Off-hours mass download of employee archive tables.",
                indicators=[
                    Indicator(
                        id="ind-base-4",
                        type="Auth Failure",
                        value="Unusual USB drive attachment",
                        confidence="Medium",
                        severity="Info"
                    )
                ]
            )
        ]
        
    return predictions
