# app/routes/newsletters.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from typing import List
from app.database import get_db
from app.models.newsletter import Newsletter
from app.models.user import User
from app.schemas.newsletter import (
    NewsletterCreate, NewsletterUpdate,
    NewsletterResponse, NewsletterListResponse
)
from app.core.security import get_current_user_email

router = APIRouter(prefix="/api/newsletters", tags=["Newsletters"])


@router.post("/", response_model=NewsletterResponse, status_code=status.HTTP_201_CREATED)
async def create_newsletter(
    newsletter_data: NewsletterCreate,
    email: str = Depends(get_current_user_email),
    db: AsyncSession = Depends(get_db)
):
    """Create a new newsletter"""
    
    # Get user
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    # Create newsletter
    new_newsletter = Newsletter(
        title=newsletter_data.title,
        subject=newsletter_data.subject,
        content_html=newsletter_data.content_html,
        content_text=newsletter_data.content_text,
        author_id=user.id,
        template_id=newsletter_data.template_id
    )
    
    db.add(new_newsletter)
    await db.commit()
    await db.refresh(new_newsletter)
    
    return new_newsletter


@router.get("/", response_model=List[NewsletterListResponse])
async def get_newsletters(
    skip: int = 0,
    limit: int = 20,
    email: str = Depends(get_current_user_email),
    db: AsyncSession = Depends(get_db)
):
    """Get all newsletters for current user"""
    
    # Get user
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    # Get newsletters
    result = await db.execute(
        select(Newsletter)
        .where(Newsletter.author_id == user.id)
        .offset(skip)
        .limit(limit)
        .order_by(Newsletter.created_at.desc())
    )
    newsletters = result.scalars().all()
    
    return newsletters


@router.get("/{newsletter_id}", response_model=NewsletterResponse)
async def get_newsletter(
    newsletter_id: int,
    email: str = Depends(get_current_user_email),
    db: AsyncSession = Depends(get_db)
):
    """Get specific newsletter by ID"""
    
    # Get user
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    # Get newsletter
    result = await db.execute(
        select(Newsletter).where(
            and_(
                Newsletter.id == newsletter_id,
                Newsletter.author_id == user.id
            )
        )
    )
    newsletter = result.scalar_one_or_none()
    
    if not newsletter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Newsletter not found"
        )
    
    return newsletter


@router.put("/{newsletter_id}", response_model=NewsletterResponse)
async def update_newsletter(
    newsletter_id: int,
    newsletter_data: NewsletterUpdate,
    email: str = Depends(get_current_user_email),
    db: AsyncSession = Depends(get_db)
):
    """Update newsletter"""
    
    # Get user
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    # Get newsletter
    result = await db.execute(
        select(Newsletter).where(
            and_(
                Newsletter.id == newsletter_id,
                Newsletter.author_id == user.id
            )
        )
    )
    newsletter = result.scalar_one_or_none()
    
    if not newsletter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Newsletter not found"
        )
    
    # Update fields
    update_data = newsletter_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(newsletter, field, value)
    
    await db.commit()
    await db.refresh(newsletter)
    
    return newsletter


@router.delete("/{newsletter_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_newsletter(
    newsletter_id: int,
    email: str = Depends(get_current_user_email),
    db: AsyncSession = Depends(get_db)
):
    """Delete newsletter"""
    
    # Get user
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    # Get newsletter
    result = await db.execute(
        select(Newsletter).where(
            and_(
                Newsletter.id == newsletter_id,
                Newsletter.author_id == user.id
            )
        )
    )
    newsletter = result.scalar_one_or_none()
    
    if not newsletter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Newsletter not found"
        )
    
    await db.delete(newsletter)
    await db.commit()
    
    return None
