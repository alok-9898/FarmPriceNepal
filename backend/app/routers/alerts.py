"""
FarmPriceNepal – Alerts Router
"""

from fastapi import APIRouter, Depends
from typing import List
from app.models import AlertCreate, AlertResponse
from app.database import get_db
from app.services.auth_service import get_current_user
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/subscribe", response_model=AlertResponse)
async def subscribe_alert(alert_in: AlertCreate, current_user=Depends(get_current_user), db=Depends(get_db)):
    alert_dict = alert_in.dict()
    alert_dict["alert_id"] = str(uuid.uuid4())
    alert_dict["user_id"] = current_user["user_id"]
    alert_dict["created_at"] = datetime.utcnow()
    alert_dict["is_active"] = True
    
    await db.alerts.insert_one(alert_dict)
    return alert_dict

@router.get("/", response_model=List[AlertResponse])
async def get_alerts(current_user=Depends(get_current_user), db=Depends(get_db)):
    alerts = await db.alerts.find({"user_id": current_user["user_id"]}).to_list(100)
    return alerts
