from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.sessions import get_db
from app.db import models
from app.deps.auth import require_role

router = APIRouter(prefix="/audit", tags=["Audit"])


@router.get("/", response_model=List[dict])
def list_audit_logs(
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin")),
):
    logs = (
        db.query(models.AuditLog)
        .order_by(models.AuditLog.created_at.desc())
        .limit(100)
        .all()
    )
    return [
        {
            "id": log.id,
            "created_at": log.created_at,
            "user_id": log.user_id,
            "action": log.action,
            "entity_type": log.entity_type,
            "entity_id": log.entity_id,
            "description": log.description,
            "details": log.details,
        }
        for log in logs
    ]
