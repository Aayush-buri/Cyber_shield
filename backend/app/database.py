import sqlite3
import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "cybershield.db"))

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # 1. Assets Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS assets (
        id TEXT PRIMARY KEY,
        name TEXT,
        type TEXT,
        ip TEXT,
        status TEXT,
        risk_score INTEGER,
        cpu_percent REAL,
        memory_percent REAL,
        network_traffic_mbps REAL,
        failed_logins INTEGER,
        file_creations INTEGER,
        file_modifications INTEGER,
        zone TEXT,
        os TEXT,
        owner TEXT,
        last_activity TEXT
    )
    """)
    
    # 2. Incidents Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS incidents (
        id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT,
        threat_type TEXT,
        mitre_id TEXT,
        severity TEXT,
        risk_score INTEGER,
        confidence INTEGER,
        affected_asset_id TEXT,
        affected_asset_name TEXT,
        affected_asset_ip TEXT,
        affected_asset_os TEXT,
        affected_asset_owner TEXT,
        stage TEXT,
        status TEXT,
        created_at TEXT,
        updated_at TEXT,
        indicators_json TEXT,
        timeline_json TEXT,
        response_actions_json TEXT
    )
    """)
    
    # 3. Logs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        source_ip TEXT,
        host_name TEXT,
        activity_type TEXT,
        status TEXT,
        details TEXT,
        action_available TEXT
    )
    """)
    
    # 4. Simulation History Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS simulation_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT,
        scenario TEXT,
        target TEXT,
        duration TEXT,
        outcome TEXT
    )
    """)
    
    # Seed initial assets if empty
    cursor.execute("SELECT COUNT(*) FROM assets")
    if cursor.fetchone()[0] == 0:
        initial_assets = [
            ("main-server", "Main Server Cluster", "Server", "192.168.1.100", "Nominal", 14, 42.5, 56.0, 120.4, 4, 8432, 12104, "Core Cluster", "Linux Kernel 5.15 (Ubuntu 22.04 LTS)", "Infrastructure Ops", "Active (1s ago)"),
            ("db-prod-04", "DB-PROD-04 Cluster", "Database", "10.0.5.22", "Nominal", 18, 38.0, 72.5, 88.2, 2, 1420, 3410, "Core Cluster", "RHEL 9 / PostgreSQL 15", "Data Eng Team", "Active (Just now)"),
            ("pwr-plc-01", "Power Grid PLC (PWR-SW-01)", "Industrial PLC", "10.0.4.15", "Nominal", 8, 18.4, 32.0, 12.8, 0, 120, 450, "OT Power Substation", "VxWorks 7.0 RTOS", "SCADA Ops", "Active (5s ago)"),
            ("wtr-scada-42", "Water System SCADA (WTR-PLC-42)", "SCADA Controller", "10.0.5.42", "Nominal", 15, 24.1, 44.0, 18.5, 1, 310, 890, "OT Water Treatment", "Siemens SIMATIC S7-1500", "Water Utility SecOps", "Active (2s ago)"),
            ("comms-relay", "Communication Gateway (CORE-RTR-01)", "Network Gateway", "10.0.8.44", "Nominal", 12, 52.0, 61.0, 840.0, 3, 50, 120, "DMZ Boundary", "Cisco IOS-XE 17.9", "NetSec Team", "Active (Just now)"),
            ("wkst-04", "Workstation (WKST-04)", "Endpoint", "192.168.1.104", "Nominal", 20, 15.2, 48.0, 35.0, 0, 1800, 4200, "Corporate HQ", "Windows 11 Enterprise (23H2)", "Enterprise IT", "Active (10s ago)"),
            ("iot-gw-01", "IoT Gateway (VPN-NODE)", "IoT Hub", "192.168.2.50", "Nominal", 10, 22.0, 38.0, 65.0, 0, 90, 180, "IoT Sensor Grid", "Custom Embedded Linux", "IoT Architecture", "Active (3s ago)")
        ]
        cursor.executemany("""
        INSERT INTO assets (id, name, type, ip, status, risk_score, cpu_percent, memory_percent, network_traffic_mbps, failed_logins, file_creations, file_modifications, zone, os, owner, last_activity)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, initial_assets)
    
    conn.commit()
    conn.close()

def save_log(log_data: Dict[str, Any]):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO logs (id, timestamp, source_ip, host_name, activity_type, status, details, action_available)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        log_data.get("id"),
        log_data.get("timestamp"),
        log_data.get("source_ip"),
        log_data.get("host_name"),
        log_data.get("activity_type"),
        log_data.get("status"),
        log_data.get("details"),
        log_data.get("action_available")
    ))
    conn.commit()
    conn.close()

def save_incident(inc_data: Dict[str, Any]):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO incidents (
        id, title, description, threat_type, mitre_id, severity, risk_score,
        confidence, affected_asset_id, affected_asset_name, affected_asset_ip,
        affected_asset_os, affected_asset_owner, stage, status, created_at,
        updated_at, indicators_json, timeline_json, response_actions_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        inc_data.get("id"),
        inc_data.get("title"),
        inc_data.get("description"),
        inc_data.get("threat_type"),
        inc_data.get("mitre_id"),
        inc_data.get("severity"),
        inc_data.get("risk_score"),
        inc_data.get("confidence"),
        inc_data.get("affected_asset_id"),
        inc_data.get("affected_asset_name"),
        inc_data.get("affected_asset_ip"),
        inc_data.get("affected_asset_os"),
        inc_data.get("affected_asset_owner"),
        inc_data.get("stage"),
        inc_data.get("status"),
        inc_data.get("created_at"),
        inc_data.get("updated_at"),
        json.dumps(inc_data.get("indicators", [])),
        json.dumps(inc_data.get("timeline", [])),
        json.dumps(inc_data.get("response_actions", []))
    ))
    conn.commit()
    conn.close()

def save_simulation_record(record: Dict[str, Any]):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO simulation_history (timestamp, scenario, target, duration, outcome)
    VALUES (?, ?, ?, ?, ?)
    """, (
        record.get("timestamp"),
        record.get("scenario"),
        record.get("target"),
        record.get("duration"),
        record.get("outcome")
    ))
    conn.commit()
    conn.close()

# Auto-initialize database on module import
init_db()
