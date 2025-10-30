# app/schemas/subscriber.py

from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, Dict


class SubscriberBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class SubscriberCreate(SubscriberBase):
    pass


class SubscriberUpdate(BaseModel):
    full_name: Optional[str] = None
    preferences: Optional[Dict] = None
    is_subscribed: Optional[bool] = None


class SubscriberResponse(SubscriberBase):
    id: int
    is_subscribed: bool
    preferences: Dict
    subscribed_at: datetime
    unsubscribed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class UnsubscribeRequest(BaseModel):
    email: EmailStr
    token: Optional[str] = None
