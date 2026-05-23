"""
Pydantic models – Alert
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class AlertCreate(BaseModel):
    market_id: str
    commodity_id: str
    alert_type: str = Field(..., pattern="^(spike|drop|threshold)$")
    threshold_pct: float = Field(..., gt=0, le=100, description="Percentage threshold for trigger")


class AlertResponse(BaseModel):
    alert_id: str
    user_id: str
    market_id: str
    commodity_id: str
    alert_type: str
    threshold_pct: float
    is_active: bool = True
    created_at: datetime
    last_triggered: Optional[datetime] = None


class AlertInDB(BaseModel):
    alert_id: str
    user_id: str
    market_id: str
    commodity_id: str
    alert_type: str
    threshold_pct: float
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_triggered: Optional[datetime] = None
