import asyncio
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.state import state
from app.routers import (
    devices,
    monitoring,
    threats,
    incidents,
    simulation,
    containment,
    recovery,
    logs
)

# Background telemetry ticking task
async def telemetry_ticker():
    while True:
        try:
            state.tick_telemetry()
            await asyncio.sleep(2)
        except asyncio.CancelledError:
            break
        except Exception as e:
            print(f"Error in telemetry ticker: {e}")
            await asyncio.sleep(2)

@asynccontextmanager
async def lifespan(app: FastAPI):
    ticker_task = asyncio.create_task(telemetry_ticker())
    yield
    ticker_task.cancel()
    try:
        await ticker_task
    except asyncio.CancelledError:
        pass

app = FastAPI(
    title="CyberShield AI - Enterprise SOC Platform",
    description="Full-stack cybersecurity simulation and threat response platform",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(devices.router)
app.include_router(monitoring.router)
app.include_router(threats.router)
app.include_router(incidents.router)
app.include_router(simulation.router)
app.include_router(containment.router)
app.include_router(recovery.router)
app.include_router(logs.router)

# Health endpoint
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CyberShield AI Enterprise SOC",
        "assets_count": len(state.assets),
        "incidents_count": len(state.incidents)
    }

# Mount static frontend directory
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend"))
if os.path.exists(frontend_dir):
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

    @app.get("/")
    async def serve_index():
        return FileResponse(os.path.join(frontend_dir, "index.html"))

    @app.get("/{full_path:path}")
    async def catch_all(full_path: str):
        file_path = os.path.join(frontend_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dir, "index.html"))
