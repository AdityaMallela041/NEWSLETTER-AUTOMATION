# app/schemas/analytics.py

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class AnalyticsBase(BaseModel):
    newsletter_id: int


class AnalyticsResponse(AnalyticsBase):
    id: int
    total_sent: int
    total_delivered: int
    total_opened: int
    total_clicked: int
    total_bounced: int
    total_unsubscribed: int
    open_rate: float
    click_rate: float
    bounce_rate: float
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class OverviewStats(BaseModel):
    total_newsletters: int
    total_subscribers: int
    total_sent: int
    avg_open_rate: float
    avg_click_rate: float
