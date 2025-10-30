# app/schemas/schedule.py

from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.schedule import ScheduleStatus


class ScheduleBase(BaseModel):
    newsletter_id: int
    scheduled_for: datetime
    cron_expression: Optional[str] = None


class ScheduleCreate(ScheduleBase):
    pass


class ScheduleUpdate(BaseModel):
    scheduled_for: Optional[datetime] = None
    cron_expression: Optional[str] = None
    status: Optional[ScheduleStatus] = None


class ScheduleResponse(ScheduleBase):
    id: int
    status: ScheduleStatus
    retry_count: int
    error_message: Optional[str]
    executed_at: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True
