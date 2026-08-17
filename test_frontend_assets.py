import urllib.request
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000"

files_to_check = [
    "/",
    "/css/soc.css",
    "/js/app.js",
    "/js/api.js",
    "/js/store.js",
    "/js/components/sidebar.js",
    "/js/components/topbar.js",
    "/js/components/toast.js",
    "/js/views/overview.js",
    "/js/views/monitoring.js",
    "/js/views/infrastructure.js",
    "/js/views/threats.js",
    "/js/views/incidentDetails.js",
    "/js/views/simulator.js",
    "/js/views/recovery.js",
    "/js/views/logs.js"
]

def check_frontend_assets():
    print("Checking Frontend Asset Delivery...")
    for path in files_to_check:
        url = f"{BASE_URL}{path}"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as resp:
            content = resp.read()
            status = resp.status
            print(f"  [OK] {path} -> HTTP {status} ({len(content)} bytes)")
            assert status == 200
            assert len(content) > 0

    print("\n[SUCCESS] All frontend assets and views are serving correctly!")

if __name__ == "__main__":
    check_frontend_assets()
