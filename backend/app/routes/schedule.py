# app/routes/schedule.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.models.schedule import Schedule
from app.schemas.schedule import ScheduleCreate, ScheduleUpdate, ScheduleResponse
from app.core.security import get_current_user_email

router = APIRouter(prefix="/api/schedule", tags=["Schedule"])


@router.post("/", response_model=ScheduleResponse, status_code=status.HTTP_201_CREATED)
async def create_schedule(
    schedule_data: ScheduleCreate,
    email: str = Depends(get_current_user_email),
    db: AsyncSession = Depends(get_db)
):
    """Schedule a newsletter to be sent"""
    
    new_schedule = Schedule(
        newsletter_id=schedule_data.newsletter_id,
        scheduled_for=schedule_data.scheduled_for,
        cron_expression=schedule_data.cron_expression
    )
    
    db.add(new_schedule)
    await db.commit()
    await db.refresh(new_schedule)
    
    return new_schedule


@router.get("/", response_model=List[ScheduleResponse])
async def get_schedules(
    skip: int = 0,
    limit: int = 50,
    email: str = Depends(get_current_user_email),
    db: AsyncSession = Depends(get_db)
):
    """Get all scheduled newsletters"""
    
    result = await db.execute(
        select(Schedule)
        .offset(skip)
        .limit(limit)
        .order_by(Schedule.scheduled_for.asc())
    )
    schedules = result.scalars().all()
    
    return schedules


@router.put("/{schedule_id}", response_model=ScheduleResponse)
async def update_schedule(
    schedule_id: int,
    schedule_data: ScheduleUpdate,
    email: str = Depends(get_current_user_email),
    db: AsyncSession = Depends(get_db)
):
    """Update schedule"""
    
    result = await db.execute(select(Schedule).where(Schedule.id == schedule_id))
    schedule = result.scalar_one_or_none()
    
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )
    
    # Update fields
    update_data = schedule_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(schedule, field, value)
    
    await db.commit()
    await db.refresh(schedule)
    
    return schedule


@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_schedule(
    schedule_id: int,
    email: str = Depends(get_current_user_email),
    db: AsyncSession = Depends(get_db)
):
    """Cancel/delete schedule"""
    
    result = await db.execute(select(Schedule).where(Schedule.id == schedule_id))
    schedule = result.scalar_one_or_none()
    
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Schedule not found"
        )
    
    await db.delete(schedule)
    await db.commit()
    
    return None
