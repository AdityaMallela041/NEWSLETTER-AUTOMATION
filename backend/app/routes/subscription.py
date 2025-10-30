# app/routes/subscription.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from app.database import get_db
from app.models.subscriber import Subscriber
from app.schemas.subscriber import SubscriberCreate, SubscriberResponse, UnsubscribeRequest
from app.core.utils import generate_random_string

router = APIRouter(prefix="/api/subscription", tags=["Subscription"])


@router.post("/subscribe", response_model=SubscriberResponse, status_code=status.HTTP_201_CREATED)
async def subscribe(
    subscriber_data: SubscriberCreate,
    db: AsyncSession = Depends(get_db)
):
    """Subscribe to newsletter"""
    
    # Check if already subscribed
    result = await db.execute(
        select(Subscriber).where(Subscriber.email == subscriber_data.email)
    )
    existing_subscriber = result.scalar_one_or_none()
    
    if existing_subscriber:
        if existing_subscriber.is_subscribed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already subscribed"
            )
        else:
            # Re-subscribe
            existing_subscriber.is_subscribed = True
            existing_subscriber.subscribed_at = datetime.utcnow()
            existing_subscriber.unsubscribed_at = None
            await db.commit()
            await db.refresh(existing_subscriber)
            return existing_subscriber
    
    # Create new subscriber
    unsubscribe_token = generate_random_string(64)
    new_subscriber = Subscriber(
        email=subscriber_data.email,
        full_name=subscriber_data.full_name,
        unsubscribe_token=unsubscribe_token
    )
    
    db.add(new_subscriber)
    await db.commit()
    await db.refresh(new_subscriber)
    
    return new_subscriber


@router.post("/unsubscribe", status_code=status.HTTP_200_OK)
async def unsubscribe(
    request: UnsubscribeRequest,
    db: AsyncSession = Depends(get_db)
):
    """Unsubscribe from newsletter"""
    
    # Find subscriber
    query = select(Subscriber).where(Subscriber.email == request.email)
    
    if request.token:
        query = query.where(Subscriber.unsubscribe_token == request.token)
    
    result = await db.execute(query)
    subscriber = result.scalar_one_or_none()
    
    if not subscriber:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscriber not found"
        )
    
    # Unsubscribe
    subscriber.is_subscribed = False
    subscriber.unsubscribed_at = datetime.utcnow()
    
    await db.commit()
    
    return {"message": "Successfully unsubscribed"}
