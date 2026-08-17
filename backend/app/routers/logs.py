from fastapi import APIRouter, Query
from typing import List, Optional
from app.models import LogEntry
from app.state import state

router = APIRouter(prefix="/api/logs", tags=["logs"])

@router.get("", response_model=List[LogEntry])
def get_logs(
    level: Optional[str] = Query(None, description="Filter by level: CRITICAL, WARNING, INFO"),
    search: Optional[str] = Query(None, description="Search term in IP, host, or details"),
    limit: int = Query(50, ge=1, le=200)
):
    results = state.logs
    if level:
        results = [l for l in results if l.status.upper() == level.upper()]
    if search:
        s = search.lower()
        results = [
            l for l in results
            if s in l.source_ip.lower()
            or s in l.host_name.lower()
            or s in l.activity_type.lower()
            or s in l.details.lower()
        ]
    return results[:limit]
