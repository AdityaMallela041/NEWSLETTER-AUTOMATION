# app/routes/generate.py

from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.core.security import get_current_user_email
from app.services.newsletter_service import generate_newsletter_content

router = APIRouter(prefix="/api/generate", tags=["Generate"])


@router.post("/newsletter")
async def generate_newsletter(
    background_tasks: BackgroundTasks,
    email: str = Depends(get_current_user_email),
    db: AsyncSession = Depends(get_db)
):
    """Generate AI-powered newsletter content"""
    
    # Add to background tasks
    background_tasks.add_task(generate_newsletter_content, email, db)
    
    return {
        "message": "Newsletter generation started",
        "status": "processing"
    }
