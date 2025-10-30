# app/routes/analytics.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.analytics import Analytics
from app.models.newsletter import Newsletter
from app.models.subscriber import Subscriber
from app.schemas.analytics import AnalyticsResponse, OverviewStats
from app.core.security import get_current_user_email
from datetime import datetime, timedelta


router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/overview", response_model=OverviewStats)
async def get_overview_stats(
    email: str = Depends(get_current_user_email),
    db: AsyncSession = Depends(get_db)
):
    """Get overview statistics"""
    
    # Count total newsletters
    result = await db.execute(select(func.count(Newsletter.id)))
    total_newsletters = result.scalar() or 0
    
    # Count total subscribers
    result = await db.execute(
        select(func.count(Subscriber.id)).where(Subscriber.is_subscribed == True)
    )
    total_subscribers = result.scalar() or 0
    
    # Sum total sent
    result = await db.execute(select(func.sum(Analytics.total_sent)))
    total_sent = result.scalar() or 0
    
    # Calculate average open rate
    result = await db.execute(select(func.avg(Analytics.open_rate)))
    avg_open_rate = result.scalar() or 0.0
    
    # Calculate average click rate
    result = await db.execute(select(func.avg(Analytics.click_rate)))
    avg_click_rate = result.scalar() or 0.0
    
    return {
        "total_newsletters": total_newsletters,
        "total_subscribers": total_subscribers,
        "total_sent": int(total_sent),
        "avg_open_rate": round(float(avg_open_rate), 2),
        "avg_click_rate": round(float(avg_click_rate), 2)
    }


@router.get("/{newsletter_id}", response_model=AnalyticsResponse)
async def get_newsletter_analytics(
    newsletter_id: int,
    email: str = Depends(get_current_user_email),
    db: AsyncSession = Depends(get_db)
):
    """Get analytics for specific newsletter"""
    
    result = await db.execute(
        select(Analytics).where(Analytics.newsletter_id == newsletter_id)
    )
    analytics = result.scalar_one_or_none()
    
    if not analytics:
        # Return default analytics if not found
        return AnalyticsResponse(
            id=0,
            newsletter_id=newsletter_id,
            total_sent=0,
            total_delivered=0,
            total_opened=0,
            total_clicked=0,
            total_bounced=0,
            total_unsubscribed=0,
            open_rate=0.0,
            click_rate=0.0,
            bounce_rate=0.0,
            created_at=datetime.utcnow(),
            updated_at=None
        )
    
    return analytics
