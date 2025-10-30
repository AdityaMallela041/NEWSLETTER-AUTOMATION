# app/schemas/article.py

from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime
from typing import Optional, List


class ArticleBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=500)
    body: str
    summary: Optional[str] = None
    tags: List[str] = []
    source_url: Optional[HttpUrl] = None
    image_url: Optional[HttpUrl] = None


class ArticleCreate(ArticleBase):
    pass


class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    summary: Optional[str] = None
    tags: Optional[List[str]] = None
    source_url: Optional[HttpUrl] = None
    image_url: Optional[HttpUrl] = None
    is_published: Optional[bool] = None


class ArticleResponse(ArticleBase):
    id: int
    author_id: int
    published_at: Optional[datetime]
    is_published: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True
