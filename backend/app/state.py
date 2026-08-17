import random
from datetime import datetime
from typing import List, Dict, Optional, Any
from app.models import (
    Asset, Threat, Incident, IncidentTimelineEvent, Indicator,
    TelemetrySnapshot, LogEntry, RecoveryTask
)
from app.risk_engine import calculate_asset_risk, evaluate_threat_predictions

class SOCState:
    def __init__(self):
        self.reset_to_default()
        
    def reset_to_default(self):
        # 1. Initial 7 Virtual Assets
        self.assets: Dict[str, Asset] = {
            "main-server": Asset(
                id="main-server",
                name="Main Server Cluster",
                type="Server",
                ip="192.168.1.100",
                status="Nominal",
                risk_score=14,
                cpu_percent=42.5,
                memory_percent=56.0,
                network_traffic_mbps=120.4,
                failed_logins=4,
                file_creations=8432,
                file_modifications=12104,
                zone="Core Cluster",
                os="Linux Kernel 5.15 (Ubuntu 22.04 LTS)",
                owner="Infrastructure Ops",
                last_activity="Active (1s ago)"
            ),
            "db-prod-04": Asset(
                id="db-prod-04",
                name="DB-PROD-04 Cluster",
                type="Database",
                ip="10.0.5.22",
                status="Nominal",
                risk_score=18,
                cpu_percent=38.0,
                memory_percent=72.5,
                network_traffic_mbps=88.2,
                failed_logins=2,
                file_creations=1420,
                file_modifications=3410,
                zone="Core Cluster",
                os="RHEL 9 / PostgreSQL 15",
                owner="Data Eng Team",
                last_activity="Active (Just now)"
            ),
            "pwr-plc-01": Asset(
                id="pwr-plc-01",
                name="Power Grid PLC (PWR-SW-01)",
                type="Industrial PLC",
                ip="10.0.4.15",
                status="Nominal",
                risk_score=8,
                cpu_percent=18.4,
                memory_percent=24.0,
                network_traffic_mbps=14.5,
                failed_logins=0,
                file_creations=210,
                file_modifications=140,
                zone="Power Grid Network",
                os="VxWorks RTOS 7.0",
                owner="Grid Systems Sec",
                last_activity="Telemetry sync (2s ago)"
            ),
            "wtr-scada-42": Asset(
                id="wtr-scada-42",
                name="Water System SCADA (WTR-PLC-42)",
                type="SCADA",
                ip="10.0.5.42",
                status="Nominal",
                risk_score=12,
                cpu_percent=22.8,
                memory_percent=31.2,
                network_traffic_mbps=28.1,
                failed_logins=1,
                file_creations=450,
                file_modifications=890,
                zone="Water Control Sys",
                os="Siemens SIMATIC WinCC",
                owner="SCADA Engineering",
                last_activity="Telemetry sync (4s ago)"
            ),
            "comms-relay": Asset(
                id="comms-relay",
                name="Communication Gateway (CORE-RTR-01)",
                type="Gateway",
                ip="10.0.8.44",
                status="Nominal",
                risk_score=15,
                cpu_percent=48.2,
                memory_percent=41.0,
                network_traffic_mbps=340.5,
                failed_logins=6,
                file_creations=120,
                file_modifications=95,
                zone="Comms Relay",
                os="Cisco IOS-XE 17.6",
                owner="Network Ops",
                last_activity="Active (1s ago)"
            ),
            "wkst-04": Asset(
                id="wkst-04",
                name="Workstation (WKST-04)",
                type="Workstation",
                ip="192.168.1.104",
                status="Nominal",
                risk_score=10,
                cpu_percent=26.4,
                memory_percent=45.0,
                network_traffic_mbps=45.0,
                failed_logins=3,
                file_creations=890,
                file_modifications=1200,
                zone="Enterprise Workstations",
                os="Windows 11 Enterprise",
                owner="Corporate Sec",
                last_activity="User session active"
            ),
            "iot-gateway": Asset(
                id="iot-gateway",
                name="IoT Gateway (VPN-NODE)",
                type="IoT Gateway",
                ip="192.168.2.50",
                status="Nominal",
                risk_score=12,
                cpu_percent=32.0,
                memory_percent=38.5,
                network_traffic_mbps=95.0,
                failed_logins=2,
                file_creations=340,
                file_modifications=410,
                zone="Edge Perimeter",
                os="Debian 12 ARM64",
                owner="Edge IoT Sec",
                last_activity="Heartbeat (5s ago)"
            )
        }
        
        # 2. Incidents
        self.incidents: Dict[str, Incident] = {
            "INC-8492": Incident(
                id="INC-8492",
                title="Anomalous Data Exfiltration",
                description="Detected via Deep Packet Inspection on Gateway Alpha. High confidence of data exfiltration to unauthorized external IP.",
                threat_type="Data Exfiltration (T1048)",
                mitre_id="T1048",
                severity="Critical",
                risk_score=88,
                confidence=94,
                affected_asset_id="db-prod-04",
                affected_asset_name="DB-PROD-04",
                affected_asset_ip="10.0.5.22",
                affected_asset_os="Linux Kernel 5.15 / RHEL 9",
                affected_asset_owner="Data Eng Team",
                stage="contain",
                status="Active",
                created_at="2026-08-17 14:32:01",
                updated_at="Just now",
                indicators=[
                    Indicator(
                        id="ind-1",
                        type="IP Address",
                        value="192.168.45.102",
                        confidence="High",
                        severity="Critical",
                        details="Remote unauthorized destination IP"
                    ),
                    Indicator(
                        id="ind-2",
                        type="File Hash (SHA256)",
                        value="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                        confidence="Medium",
                        severity="Warning",
                        details="Suspicious archive extraction binary"
                    ),
                    Indicator(
                        id="ind-3",
                        type="Network Port",
                        value="TCP Port 8443 (Direct SSL Tunnel)",
                        confidence="High",
                        severity="Critical",
                        details="High volume uninspected encrypted outbound flow"
                    ),
                    Indicator(
                        id="ind-4",
                        type="Auth Failure",
                        value="Privilege Escalation on service account",
                        confidence="High",
                        severity="Critical",
                        details="sudo /bin/tar command executed under restricted user"
                    )
                ],
                timeline=[
                    IncidentTimelineEvent(
                        time="14:15:00",
                        stage="Predict",
                        title="AI Anomaly Flag",
                        description="Predictive model flagged unusual out-of-hours data query volume.",
                        status="Completed"
                    ),
                    IncidentTimelineEvent(
                        time="14:28:45",
                        stage="Detect",
                        title="DPI Signature Match",
                        description="Deep packet inspection confirmed unauthorized external payload transfer.",
                        status="Completed"
                    ),
                    IncidentTimelineEvent(
                        time="14:32:01",
                        stage="Contain",
                        title="Containment Action Pending",
                        description="Automated response playbook recommended network isolation.",
                        status="Active"
                    ),
                    IncidentTimelineEvent(
                        time="Pending",
                        stage="Recover",
                        title="Restoration Playbook",
                        description="Backup verification and database shard synchronization.",
                        status="Pending"
                    )
                ],
                response_actions=[
                    "Isolate Asset from VLAN 10",
                    "Block external IP 192.168.45.102 at perimeter firewall",
                    "Invalidate active database connection pools"
                ]
            )
        }
        
        # 3. Logs
        self.logs: List[LogEntry] = [
            LogEntry(
                id="log-1",
                timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                source_ip="192.168.1.100",
                host_name="MAIN-SRV-01",
                activity_type="Unauthorized Access Attempt",
                status="CRITICAL",
                details="Repeated root password attempts from internal segment.",
                action_available="Isolate"
            ),
            LogEntry(
                id="log-2",
                timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                source_ip="10.0.5.22",
                host_name="DB-PROD-04",
                activity_type="Anomalous Traffic Spike",
                status="WARNING",
                details="Egress transfer reached 4.2 TB/s across port 8443.",
                action_available="Investigate"
            ),
            LogEntry(
                id="log-3",
                timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                source_ip="172.16.0.55",
                host_name="GW-INT-A",
                activity_type="Port Scan Detected",
                status="INFO",
                details="SYN flood probe targeting ports 1-1024 dropped by firewall.",
                action_available="Blocked"
            ),
            LogEntry(
                id="log-4",
                timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                source_ip="192.168.1.104",
                host_name="WKST-04",
                activity_type="Privilege Escalation Attempt",
                status="CRITICAL",
                details="Execution of mimikatz credential scraper detected and intercepted.",
                action_available="Isolate"
            ),
            LogEntry(
                id="log-5",
                timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                source_ip="192.168.2.50",
                host_name="VPN-NODE",
                activity_type="Multiple Failed Auth",
                status="WARNING",
                details="14 failed Kerberos handshakes from single subnet.",
                action_available="Investigate"
            )
        ]
        
        # 4. Simulation History
        self.simulation_history: List[Dict[str, Any]] = [
            {
                "timestamp": "2026-08-17 14:32:01",
                "scenario": "Ransomware (T1486)",
                "target": "DB-Cluster-04",
                "duration": "04m 12s",
                "outcome": "Defended"
            },
            {
                "timestamp": "2026-08-17 10:15:44",
                "scenario": "Data Exfil (T1048)",
                "target": "Storage-Vol-B",
                "duration": "11m 05s",
                "outcome": "Success (Breach)"
            },
            {
                "timestamp": "2026-08-16 18:45:22",
                "scenario": "Brute Force (T1110)",
                "target": "Gateway-Edge-1",
                "duration": "01m 45s",
                "outcome": "Defended"
            }
        ]
        
        # 5. Recovery State
        self.recovery_tasks: List[RecoveryTask] = [
            RecoveryTask(
                id="rec-db",
                name="Database Restoration",
                target_asset_id="db-prod-04",
                progress_percent=85,
                status="in_progress",
                eta="4m 12s",
                details="Syncing shards 14-42 with clean point-in-time snapshot."
            ),
            RecoveryTask(
                id="rec-endpoints",
                name="Endpoint Deployment",
                target_asset_id="wkst-04",
                progress_percent=40,
                status="in_progress",
                eta="2m 30s",
                details="Deploying verified security baseline agents to zone Alpha-1."
            ),
            RecoveryTask(
                id="rec-network",
                name="Network Tunneling",
                target_asset_id="comms-relay",
                progress_percent=100,
                status="completed",
                eta="0s",
                details="Connection re-established. Tunnels verified with TLS 1.3."
            )
        ]
        
        self.active_simulation: Optional[str] = None
        self.security_score = 84
        
    def tick_telemetry(self):
        """Simulates subtle continuous telemetry changes on each tick."""
        for asset in self.assets.values():
            if asset.status == "Isolated":
                asset.network_traffic_mbps = 0.0
                asset.cpu_percent = max(5.0, asset.cpu_percent - 2.0)
                continue
                
            # Random micro-fluctuations in CPU and Network
            cpu_jitter = random.uniform(-1.5, 1.5)
            asset.cpu_percent = max(5.0, min(99.0, round(asset.cpu_percent + cpu_jitter, 1)))
            
            traffic_jitter = random.uniform(-5.0, 5.0)
            asset.network_traffic_mbps = max(2.0, min(1500.0, round(asset.network_traffic_mbps + traffic_jitter, 1)))
            
            # Recalculate risk score
            score, level = calculate_asset_risk(asset)
            asset.risk_score = score
            if asset.status not in ["Isolated", "Recovering"]:
                asset.status = level

    def get_telemetry_snapshot(self) -> TelemetrySnapshot:
        total_risk = int(sum(a.risk_score for a in self.assets.values()) / len(self.assets))
        if total_risk <= 30:
            level = "LOW RISK"
        elif total_risk <= 60:
            level = "WARNING"
        elif total_risk <= 80:
            level = "HIGH RISK"
        else:
            level = "CRITICAL"
            
        online_count = sum(1 for a in self.assets.values() if a.status != "Isolated")
        online_pct = round((online_count / len(self.assets)) * 100, 1)
        
        active_threats = sum(1 for a in self.assets.values() if a.risk_score > 60)
        
        total_failed_logins = sum(a.failed_logins for a in self.assets.values()) + 1492
        total_file_creations = sum(a.file_creations for a in self.assets.values())
        total_file_modifications = sum(a.file_modifications for a in self.assets.values())
        
        avg_cpu = round(sum(a.cpu_percent for a in self.assets.values()) / len(self.assets), 1)
        avg_memory = round(sum(a.memory_percent for a in self.assets.values()) / len(self.assets), 1)
        
        return TelemetrySnapshot(
            system_risk_score=total_risk if self.active_simulation else 24,
            risk_level=level if self.active_simulation else "LOW RISK",
            active_threats_count=max(len(self.incidents), active_threats),
            monitored_devices_count=1240,
            contained_threats_count=450,
            online_percentage=online_pct,
            failed_logins_count=total_failed_logins,
            failed_logins_delta_percent=12.0,
            egress_traffic_tbs=4.2 if self.active_simulation == "exfiltration" else 1.2,
            ingress_traffic_tbs=1.8,
            file_creations_count=total_file_creations if total_file_creations > 0 else 8432,
            file_modifications_count=total_file_modifications if total_file_modifications > 0 else 12104,
            cpu_cluster_load_percent=avg_cpu if avg_cpu > 0 else 68.0,
            memory_allocation_percent=avg_memory if avg_memory > 0 else 84.0,
            traffic_history=[150, 120, 160, 90, 110, 50, 130, 80, 100, 40, 120, 60, 140, 70, 110, 75, 90, 85, 120, 60, 100],
            failed_logins_history=[25, 22, 28, 15, 20, 5, 18, 10, 25, 12, 20],
            risk_history=[20, 22, 24, 25, 23, 24, 28, 30, 24, 24, total_risk],
            last_updated=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        )

# Global singleton state
state = SOCState()
