import urllib.request
import json
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000"

def req(method, path, data=None):
    payload = json.dumps(data).encode('utf-8') if data is not None else None
    r = urllib.request.Request(f"{BASE_URL}{path}", data=payload, method=method, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(r) as resp:
        return resp.status, json.loads(resp.read().decode('utf-8'))

def audit_simulations():
    print("--- AUDITING ALL ATTACK SIMULATIONS & RECOVERY FLOWS ---")
    
    # Test 1: Ransomware Flow
    s, r = req("POST", "/api/simulate/ransomware", {"scenario": "ransomware", "target_asset_id": "db-prod-04"})
    print(f"1. Ransomware Simulation: HTTP {s} | Affected: {r['affected_asset']} | Risk: {r['risk_score']}")
    assert r['risk_score'] >= 90
    
    # Check Incidents
    s, incs = req("GET", "/api/incidents")
    print(f"   Incidents active: {len(incs)}")
    rw_inc = next((i for i in incs if "Ransomware" in i['threat_type'] or "RW" in i['id']), None)
    assert rw_inc is not None
    print(f"   Ransomware Incident: {rw_inc['id']} | Stage: {rw_inc['stage']} | Severity: {rw_inc['severity']}")
    
    # Test Containment
    s, c = req("POST", "/api/contain/db-prod-04")
    print(f"   Containment: HTTP {s} | Device: {c['device_id']} | Status: {c['status']}")
    assert c['status'] == "Isolated"
    
    # Test Recovery
    s, rec = req("POST", "/api/recover/db-prod-04")
    print(f"   Recovery: HTTP {s} | Status: {rec['status']} | Risk: {rec['risk_score']}")
    assert rec['status'] == "Nominal"
    
    # Test 2: Brute Force Flow
    s, r = req("POST", "/api/simulate/bruteforce", {"scenario": "bruteforce", "target_asset_id": "comms-relay"})
    print(f"2. Brute Force Simulation: HTTP {s} | Affected: {r['affected_asset']} | Risk: {r['risk_score']}")
    
    # Test 3: Data Exfiltration Flow
    s, r = req("POST", "/api/simulate/exfiltration", {"scenario": "exfiltration", "target_asset_id": "db-prod-04"})
    print(f"3. Data Exfiltration Simulation: HTTP {s} | Affected: {r['affected_asset']} | Risk: {r['risk_score']}")
    
    # Test 4: SCADA Intrusion Flow
    s, r = req("POST", "/api/simulate/intrusion", {"scenario": "intrusion", "target_asset_id": "wtr-scada-42"})
    print(f"4. SCADA Intrusion Simulation: HTTP {s} | Affected: {r['affected_asset']} | Risk: {r['risk_score']}")
    
    # Test 5: Master Recovery
    s, rec_all = req("POST", "/api/recover/all")
    print(f"5. Master Recovery: HTTP {s} | Security Score: {rec_all['security_score']}")
    assert rec_all['security_score'] >= 90
    
    # Test 6: Reset
    s, reset = req("POST", "/api/simulate/reset")
    print(f"6. Reset Simulation: HTTP {s}")
    assert reset['success'] == True

    print("\n[SUCCESS] ALL SIMULATION & RECOVERY FLOWS AUDITED!")

if __name__ == "__main__":
    audit_simulations()
