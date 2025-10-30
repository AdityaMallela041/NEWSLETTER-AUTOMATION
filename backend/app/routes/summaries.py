# app/routes/summaries.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.models.article import Article
from app.core.security import get_current_user_email

router = APIRouter(prefix="/api/summaries", tags=["Summaries"])


@router.get("/")
async def get_summaries(
    skip: int = 0,
    limit: int = 10,
    email: str = Depends(get_current_user_email),
    db: AsyncSession = Depends(get_db)
):
    """Get article summaries"""
    
    result = await db.execute(
        select(Article)
        .where(Article.is_published == True)
        .where(Article.summary.isnot(None))
        .offset(skip)
        .limit(limit)
        .order_by(Article.published_at.desc())
    )
    articles = result.scalars().all()
    
    summaries = [
        {
            "id": article.id,
            "title": article.title,
            "summary": article.summary,
            "tags": article.tags,
            "published_at": article.published_at
        }
        for article in articles
    ]
    
    return summaries
