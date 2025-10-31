from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.analytics_service import AnalyticsService
from app.core.security import get_current_user_email

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
async def get_analytics_overview(
    db: AsyncSession = Depends(get_db),
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        return await AnalyticsService.get_overview(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/series")
async def get_analytics_series(
    days: int = 30,
    metric: str = "open_rate",
    db: AsyncSession = Depends(get_db),
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        return await AnalyticsService.get_series(db, days, metric)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/categories")
async def get_analytics_categories(
    db: AsyncSession = Depends(get_db),
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        return await AnalyticsService.get_categories(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/topics")
async def get_analytics_topics(
    db: AsyncSession = Depends(get_db),
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        return await AnalyticsService.get_topics(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/perf")
async def get_analytics_performance(
    db: AsyncSession = Depends(get_db),
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        return await AnalyticsService.get_performance(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reach")
async def get_analytics_reach(
    days: int = 30,
    db: AsyncSession = Depends(get_db),
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        return await AnalyticsService.get_reach(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/newsletters-timeline")
async def get_newsletters_timeline(
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user_email: str = Depends(get_current_user_email)
):
    try:
        return await AnalyticsService.get_newsletters_timeline(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
