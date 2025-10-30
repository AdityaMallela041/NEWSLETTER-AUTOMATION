# app/routes/articles.py

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from typing import List, Optional
from app.database import get_db
from app.models.article import Article
from app.models.user import User
from app.schemas.article import ArticleCreate, ArticleUpdate, ArticleResponse
from app.core.security import get_current_user_email

router = APIRouter(prefix="/api/articles", tags=["Articles"])


@router.post("/", response_model=ArticleResponse, status_code=status.HTTP_201_CREATED)
async def create_article(
    article_data: ArticleCreate,
    email: str = Depends(get_current_user_email),
    db: AsyncSession = Depends(get_db)
):
    """Create a new article (editor/admin only)"""
    
    # Get user
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    # Check role
    if user.role not in ["editor", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only editors and admins can create articles"
        )
    
    # Create article
    new_article = Article(
        title=article_data.title,
        body=article_data.body,
        summary=article_data.summary,
        author_id=user.id,
        tags=article_data.tags,
        source_url=str(article_data.source_url) if article_data.source_url else None,
        image_url=str(article_data.image_url) if article_data.image_url else None
    )
    
    db.add(new_article)
    await db.commit()
    await db.refresh(new_article)
    
    return new_article


@router.get("/", response_model=List[ArticleResponse])
async def get_articles(
    skip: int = 0,
    limit: int = 20,
    search: Optional[str] = Query(None),
    tags: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    """Get all articles with optional search and filtering"""
    
    query = select(Article).where(Article.is_published == True)
    
    # Add search filter
    if search:
        query = query.where(
            or_(
                Article.title.ilike(f"%{search}%"),
                Article.body.ilike(f"%{search}%")
            )
        )
    
    # Add tags filter
    if tags:
        tag_list = tags.split(",")
        query = query.where(Article.tags.contains(tag_list))
    
    query = query.offset(skip).limit(limit).order_by(Article.published_at.desc())
    
    result = await db.execute(query)
    articles = result.scalars().all()
    
    return articles


@router.get("/{article_id}", response_model=ArticleResponse)
async def get_article(article_id: int, db: AsyncSession = Depends(get_db)):
    """Get specific article by ID"""
    
    result = await db.execute(
        select(Article).where(Article.id == article_id)
    )
    article = result.scalar_one_or_none()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    return article


@router.delete("/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_article(
    article_id: int,
    email: str = Depends(get_current_user_email),
    db: AsyncSession = Depends(get_db)
):
    """Delete article (author/admin only)"""
    
    # Get user
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    # Get article
    result = await db.execute(select(Article).where(Article.id == article_id))
    article = result.scalar_one_or_none()
    
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    # Check permissions
    if article.author_id != user.id and user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this article"
        )
    
    await db.delete(article)
    await db.commit()
    
    return None
