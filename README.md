# CyberShield AI: Enterprise Cybersecurity SOC Prototype

> A proactive, AI-driven Security Operations Center (SOC) framework that **predicts, detects, contains, and recovers** from critical infrastructure cyber threats before systems are compromised.

---

## 🚀 Key Highlights & Capabilities

- **7 Virtual Infrastructure Nodes**:
  - Main Server Cluster (`192.168.1.100`)
  - Database Cluster DB-PROD-04 (`10.0.5.22`)
  - Power Grid PLC PWR-SW-01 (`10.0.4.15`)
  - Water SCADA WTR-PLC-42 (`10.0.5.42`)
  - Communication Gateway CORE-RTR-01 (`10.0.8.44`)
  - Workstation WKST-04 (`192.168.1.104`)
  - IoT Gateway VPN-NODE (`192.168.2.50`)
- **8 Dedicated SOC Modules**:
  1. **Overview Dashboard**: High-level SOC metrics, real-time threat activity chart, critical infrastructure health, live alerts table.
  2. **Monitoring Dashboard**: Live telemetry, risk score circular gauge, failed logins sparkline, ingress/egress data transfer, 32-node CPU matrix, memory allocation.
  3. **Infrastructure Overview**: Power Grid, Water Control, Comms status, animated SVG live topology map, asset inventory table with live isolation & recovery actions.
  4. **Threat Intelligence**: AI Threat Prediction Matrix with AI Confidence ratings (0-100%), active threat alerts, lifecycle preview.
  5. **Incident Details**: 4-Stage Lifecycle Stepper (`Predict → Detect → Contain → Recover`), Tactical Analysis IoCs table (IPs, SHA256 hashes, ports), automated containment actions ("Isolate Asset", "Block IP", "Force Credential Reset").
  6. **Attack Simulator**: Interactive lab to deploy simulated Ransomware (T1486), Brute Force (T1110), Data Exfiltration (T1048), and SCADA Intrusion (T1498) attacks.
  7. **Recovery Center**: Real-time shimmering system restoration progress bars (Database Restoration, Endpoint Deployment, Network Tunneling), backup integrity audit, recovery SOP playbooks.
  8. **Audit Trail & Logs**: Filterable, searchable logs table with level badges (`CRITICAL`, `WARNING`, `INFO`), CSV and JSON export.

---

## 🛠️ Tech Stack

- **Backend**: Python (FastAPI, Uvicorn, Pydantic, Asyncio Telemetry Engine)
- **Frontend**: Single Page Application (SPA), Vanilla ES6 Modules, Tailwind CSS, Google Fonts (`Inter`, `JetBrains Mono`), Material Symbols Outlined
- **Styling**: Tailored Dark SOC Palette (`#0A0E14` base, `#121820` surface, `#00D1FF` cyan accent)

---

## 🏃 Quick Start

### 1. Launch Server
Using PowerShell / Command Prompt:
```powershell
.venv\Scripts\python.exe run.py
```
Or double-click:
```cmd
run.bat
```

### 2. Open in Browser
Navigate to:
```
http://localhost:8000
```
API Documentation:
```
http://localhost:8000/docs
```

---

## 🎮 Complete Demo Walkthrough

1. **Initial Baseline State**:
   - Open `http://localhost:8000#overview`.
   - Security Score starts at `84/100` and all infrastructure nodes are `Nominal`.
2. **Launch Attack Simulation**:
   - Navigate to **Attack Simulator** (`#simulator`).
   - Click **Ransomware Attack** under "Deploy Simulation Scenario".
   - Notice the live console changes state to `SIMULATION IN PROGRESS`.
   - Security score immediately drops to `42/100`.
   - Critical alert toast notification fires.
3. **Inspect Real-Time Telemetry**:
   - Switch to **Monitoring** (`#monitoring`).
   - Observe the circular Risk Score gauge jump to `CRITICAL (94)`.
   - File modification rate spikes to `14,820`.
   - CPU cluster load matrix glows red.
4. **Threat Intelligence & AI Prediction**:
   - Switch to **Threats** (`#threats`).
   - The AI Threat Prediction Matrix identifies `Ransomware Payload (T1486)` with `98% AI Confidence`.
5. **Incident Management & Containment**:
   - Switch to **Incident Details** (`#incidents`).
   - View the 4-Stage Lifecycle Stepper: `Predict` (Checked), `Detect` (Checked), `Contain` (Active).
   - Review confirmed Indicators of Compromise (SHA256 hash `e3b0c442...`, PID `8912`).
   - Click **Isolate Asset Immediately**.
   - Asset status transitions to `Isolated`, threat is contained.
6. **Recovery & Restoration**:
   - Switch to **Recovery Center** (`#recovery`).
   - Click **Initiate Master Recovery**.
   - Watch the animated progress bars restore Database Shards (100%) and Endpoint agents.
   - All systems return to `Healthy / Nominal`.
7. **Overview Verification**:
   - Return to **Overview** (`#overview`).
   - Security Score is restored to `96/100` and all systems display clean nominal indicators.
