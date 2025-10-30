# app/routes/feed.py

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from typing import Optional
from app.database import get_db
from app.models.article import Article

router = APIRouter(prefix="/api/feed", tags=["Feed"])


@router.get("/")
async def get_feed(
    skip: int = 0,
    limit: int = 20,
    category: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """Get content feed (trending or recent articles)"""
    
    query = select(Article).where(Article.is_published == True)
    
    # Filter by category/tag
    if category:
        query = query.where(Article.tags.contains([category]))
    
    query = query.offset(skip).limit(limit).order_by(Article.published_at.desc())
    
    result = await db.execute(query)
    articles = result.scalars().all()
    
    feed = [
        {
            "id": article.id,
            "title": article.title,
            "summary": article.summary or article.body[:200] + "...",
            "image_url": article.image_url,
            "source_url": article.source_url,
            "tags": article.tags,
            "published_at": article.published_at
        }
        for article in articles
    ]
    
    return feed
