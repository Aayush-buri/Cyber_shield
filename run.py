import os
import sys

# Force UTF-8 stdout on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

import uvicorn

if __name__ == "__main__":
    print("=" * 60)
    print("  [SHIELD] CYBERSHIELD AI - ENTERPRISE SOC PLATFORM")
    print("  Proactive Threat Prediction, Detection, Containment & Recovery")
    print("=" * 60)
    print("  Dashboard Server running at: http://localhost:8000")
    print("  API Docs available at:      http://localhost:8000/docs")
    print("=" * 60)
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        log_level="info"
    )
