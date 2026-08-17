import urllib.request
import json
import time
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000"

def get(path):
    req = urllib.request.Request(f"{BASE_URL}{path}")
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

def post(path, data=None):
    payload = json.dumps(data or {}).encode('utf-8')
    req = urllib.request.Request(f"{BASE_URL}{path}", data=payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

def run_tests():
    print("Testing CyberShield AI Backend...")
    time.sleep(1)
    
    # 1. Health Check
    health = get("/api/health")
    print("Health Check:", health)
    assert health["status"] == "healthy"
    
    # 2. Devices Check
    devices = get("/api/devices")
    print(f"Loaded {len(devices)} devices:")
    for d in devices:
        print(f"  - {d['name']} ({d['ip']}) - Status: {d['status']}, Risk: {d['risk_score']}")
    assert len(devices) == 7
    
    # 3. Monitoring Telemetry Check
    monitoring = get("/api/monitoring")
    print(f"Monitoring: System Risk = {monitoring['system_risk_score']}, Monitored = {monitoring['monitored_devices_count']}")
    assert monitoring['monitored_devices_count'] == 1240
    
    # 4. Threats Check
    threats = get("/api/threats")
    print(f"Threats: {len(threats)} AI prediction items")
    assert len(threats) >= 1
    
    # 5. Incidents Check
    incidents = get("/api/incidents")
    print(f"Incidents: {len(incidents)} active incident records")
    assert len(incidents) >= 1
    
    # 6. Simulate Ransomware Attack
    print("\n--- LAUNCHING RANSOMWARE SIMULATION ---")
    attack_res = post("/api/simulate/ransomware", {"scenario": "ransomware", "target_asset_id": "db-prod-04"})
    print("Attack Result:", attack_res)
    assert attack_res["success"] == True
    
    # Check updated telemetry
    updated_devices = get("/api/devices")
    db_asset = next(d for d in updated_devices if d["id"] == "db-prod-04")
    print(f"DB Asset after attack: Status = {db_asset['status']}, Risk = {db_asset['risk_score']}, File mods = {db_asset['file_modifications']}")
    assert db_asset["status"] == "Critical"
    assert db_asset["risk_score"] >= 80
    
    # 7. Containment Test
    print("\n--- EXECUTING CONTAINMENT ---")
    contain_res = post("/api/contain/db-prod-04")
    print("Containment Result:", contain_res)
    assert contain_res["success"] == True
    
    contained_devices = get("/api/devices")
    db_contained = next(d for d in contained_devices if d["id"] == "db-prod-04")
    print(f"DB Asset after containment: Status = {db_contained['status']}, Traffic = {db_contained['network_traffic_mbps']}")
    assert db_contained["status"] == "Isolated"
    
    # 8. Recovery Test
    print("\n--- EXECUTING RECOVERY ---")
    recover_res = post("/api/recover/db-prod-04")
    print("Recovery Result:", recover_res)
    assert recover_res["success"] == True
    
    recovered_devices = get("/api/devices")
    db_recovered = next(d for d in recovered_devices if d["id"] == "db-prod-04")
    print(f"DB Asset after recovery: Status = {db_recovered['status']}, Risk = {db_recovered['risk_score']}")
    assert db_recovered["status"] == "Nominal"
    
    # 9. Logs Check
    logs = get("/api/logs")
    print(f"Logs count: {len(logs)}")
    assert len(logs) >= 5
    
    # 10. Master Reset
    print("\n--- MASTER RESET ---")
    reset_res = post("/api/simulate/reset")
    print("Reset Result:", reset_res)
    assert reset_res["success"] == True
    
    print("\n[SUCCESS] ALL BACKEND AND FLOW TESTS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    run_tests()
