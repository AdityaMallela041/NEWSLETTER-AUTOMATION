# app/schemas/newsletter.py

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from app.models.newsletter import NewsletterStatus


class NewsletterBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    subject: str = Field(..., min_length=1, max_length=500)
    content_html: str
    content_text: Optional[str] = None


class NewsletterCreate(NewsletterBase):
    template_id: Optional[int] = None


class NewsletterUpdate(BaseModel):
    title: Optional[str] = None
    subject: Optional[str] = None
    content_html: Optional[str] = None
    content_text: Optional[str] = None
    status: Optional[NewsletterStatus] = None
    scheduled_for: Optional[datetime] = None


class NewsletterResponse(NewsletterBase):
    id: int
    status: NewsletterStatus
    author_id: int
    template_id: Optional[int]
    scheduled_for: Optional[datetime]
    sent_at: Optional[datetime]
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class NewsletterListResponse(BaseModel):
    id: int
    title: str
    subject: str
    status: NewsletterStatus
    author_id: int
    created_at: datetime
    sent_at: Optional[datetime]
    
    class Config:
        from_attributes = True
