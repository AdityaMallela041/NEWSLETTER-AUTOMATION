# app/services/analytics_service.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.analytics import Analytics
from app.models.newsletter import Newsletter


async def create_analytics_for_newsletter(newsletter_id: int, db: AsyncSession):
    """Create analytics entry for newsletter"""
    
    new_analytics = Analytics(
        newsletter_id=newsletter_id,
        total_sent=0,
        total_delivered=0,
        total_opened=0,
        total_clicked=0,
        total_bounced=0,
        total_unsubscribed=0,
        open_rate=0.0,
        click_rate=0.0,
        bounce_rate=0.0
    )
    
    db.add(new_analytics)
    await db.commit()
    await db.refresh(new_analytics)
    
    return new_analytics


async def update_analytics(newsletter_id: int, event_type: str, db: AsyncSession):
    """Update analytics for specific event"""
    
    result = await db.execute(
        select(Analytics).where(Analytics.newsletter_id == newsletter_id)
    )
    analytics = result.scalar_one_or_none()
    
    if not analytics:
        analytics = await create_analytics_for_newsletter(newsletter_id, db)
    
    # Update counters based on event type
    if event_type == "sent":
        analytics.total_sent += 1
    elif event_type == "delivered":
        analytics.total_delivered += 1
    elif event_type == "opened":
        analytics.total_opened += 1
    elif event_type == "clicked":
        analytics.total_clicked += 1
    elif event_type == "bounced":
        analytics.total_bounced += 1
    elif event_type == "unsubscribed":
        analytics.total_unsubscribed += 1
    
    # Recalculate rates
    if analytics.total_delivered > 0:
        analytics.open_rate = (analytics.total_opened / analytics.total_delivered) * 100
        analytics.click_rate = (analytics.total_clicked / analytics.total_delivered) * 100
    
    if analytics.total_sent > 0:
        analytics.bounce_rate = (analytics.total_bounced / analytics.total_sent) * 100
    
    await db.commit()
    await db.refresh(analytics)
    
    return analytics
