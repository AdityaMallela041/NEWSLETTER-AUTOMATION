# app/schemas/template.py

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class TemplateBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    html_content: str
    thumbnail_url: Optional[str] = None


class TemplateCreate(TemplateBase):
    pass


class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    html_content: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_default: Optional[bool] = None


class TemplateResponse(TemplateBase):
    id: int
    is_default: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True
