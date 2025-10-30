# app/services/scheduler_service.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from app.models.schedule import Schedule, ScheduleStatus
from app.services.newsletter_service import send_newsletter_to_subscribers


async def process_pending_schedules(db: AsyncSession):
    """Process all pending scheduled newsletters"""
    
    now = datetime.utcnow()
    
    # Get all pending schedules that should be executed
    result = await db.execute(
        select(Schedule).where(
            Schedule.status == ScheduleStatus.PENDING,
            Schedule.scheduled_for <= now
        )
    )
    schedules = result.scalars().all()
    
    for schedule in schedules:
        try:
            # Update status to processing
            schedule.status = ScheduleStatus.PROCESSING
            await db.commit()
            
            # Send newsletter
            success = await send_newsletter_to_subscribers(schedule.newsletter_id, db)
            
            if success:
                schedule.status = ScheduleStatus.COMPLETED
                schedule.executed_at = datetime.utcnow()
            else:
                schedule.status = ScheduleStatus.FAILED
                schedule.error_message = "Failed to send newsletter"
                schedule.retry_count += 1
            
            await db.commit()
            
        except Exception as e:
            schedule.status = ScheduleStatus.FAILED
            schedule.error_message = str(e)
            schedule.retry_count += 1
            await db.commit()
            print(f"❌ Failed to process schedule {schedule.id}: {e}")
