# app/services/analytics_service.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.analytics import Analytics
from datetime import datetime
import math

class AnalyticsService:
    """
    Centralized service to manage all analytics data
    Ensures numbers are consistent across all endpoints
    Uses dummy data + real updates
    """

    @staticmethod
    async def get_overview(db: AsyncSession):
        """
        Returns aggregated analytics matching all endpoints
        Keeps dummy data + updates from real actions
        """
        result = await db.execute(select(Analytics))
        analytics = result.scalars().all()
        
        # Aggregate all newsletter analytics (dummy + updates)
        total_sent = sum(a.total_sent or 0 for a in analytics)
        total_opened = sum(a.total_opened or 0 for a in analytics)
        total_clicked = sum(a.total_clicked or 0 for a in analytics)
        
        # Calculate rates
        open_rate = round(
            (total_opened / total_sent * 100) if total_sent > 0 else 0, 2
        )
        click_rate = round(
            (total_clicked / total_sent * 100) if total_sent > 0 else 0, 2
        )
        
        # Dummy subscribers (keeps initial value)
        total_subscribers = 2100
        
        return {
            "total_newsletters": len(analytics),
            "total_sent": total_sent,
            "total_opened": total_opened,
            "total_clicked": total_clicked,
            "open_rate": open_rate,
            "click_rate": click_rate,
            "total_subscribers": total_subscribers
        }

    @staticmethod
    async def get_series(db: AsyncSession, days: int = 30, metric: str = "open_rate"):
        """
        Return time series data - Week 1-4 with dummy data
        Week data stays constant
        """
        return [
            {"name": "Week 1", "subscribers": 1200, "reach": 2400, metric: 45.2},
            {"name": "Week 2", "subscribers": 1500, "reach": 2800, metric: 48.5},
            {"name": "Week 3", "subscribers": 1800, "reach": 3200, metric: 52.1},
            {"name": "Week 4", "subscribers": 2100, "reach": 3800, metric: 55.8},
        ]

    @staticmethod
    async def get_categories(db: AsyncSession):
        """
        Return category breakdown - dummy data (constant)
        """
        return [
            {"name": "Technology", "value": 35},
            {"name": "Business", "value": 25},
            {"name": "Science", "value": 20},
            {"name": "Other", "value": 20},
        ]

    @staticmethod
    async def get_topics(db: AsyncSession):
        """
        Return top topics - dummy data (constant)
        """
        return [
            {"name": "AI", "value": 24},
            {"name": "ML", "value": 18},
            {"name": "NLP", "value": 12},
            {"name": "Vision", "value": 10},
        ]

    @staticmethod
    async def get_performance(db: AsyncSession):
        """
        Return performance metrics - dummy data (constant)
        """
        return [
            {"label": "Summarization", "score": 82},
            {"label": "Tagging", "score": 74},
            {"label": "Routing", "score": 66},
            {"label": "Clustering", "score": 58},
        ]

    @staticmethod
    async def get_reach(db: AsyncSession):
        """
        Return reach over time - 10 days with dummy data
        """
        days = []
        for i in range(10):
            date = datetime.fromtimestamp(
                datetime.now().timestamp() - (9 - i) * 86400
            ).strftime("%m/%d")
            count = 10 + round(8 * math.sin(i / 2)) + i
            days.append({"date": date, "count": count})
        return days

    @staticmethod
    async def get_newsletters_timeline(db: AsyncSession):
        """
        Return newsletter timeline - Jan to Jun dummy data
        """
        return [
            {"date": "Jan", "count": 12},
            {"date": "Feb", "count": 19},
            {"date": "Mar", "count": 15},
            {"date": "Apr", "count": 25},
            {"date": "May", "count": 22},
            {"date": "Jun", "count": 28},
        ]

    @staticmethod
    async def increment_newsletter_sent(db: AsyncSession, newsletter_id: int):
        """
        Called when newsletter is sent - UPDATES analytics
        """
        result = await db.execute(
            select(Analytics).where(Analytics.newsletter_id == newsletter_id)
        )
        analytics = result.scalar_one_or_none()
        
        if analytics:
            analytics.total_sent = (analytics.total_sent or 0) + 1
            await db.commit()

    @staticmethod
    async def increment_newsletter_open(db: AsyncSession, newsletter_id: int):
        """
        Called when user opens email - UPDATES analytics
        """
        result = await db.execute(
            select(Analytics).where(Analytics.newsletter_id == newsletter_id)
        )
        analytics = result.scalar_one_or_none()
        
        if analytics:
            analytics.total_opened = (analytics.total_opened or 0) + 1
            # Recalculate rate
            if analytics.total_sent:
                analytics.open_rate = round(
                    (analytics.total_opened / analytics.total_sent * 100), 2
                )
            await db.commit()

    @staticmethod
    async def increment_newsletter_click(db: AsyncSession, newsletter_id: int):
        """
        Called when user clicks link - UPDATES analytics
        """
        result = await db.execute(
            select(Analytics).where(Analytics.newsletter_id == newsletter_id)
        )
        analytics = result.scalar_one_or_none()
        
        if analytics:
            analytics.total_clicked = (analytics.total_clicked or 0) + 1
            # Recalculate rate
            if analytics.total_sent:
                analytics.click_rate = round(
                    (analytics.total_clicked / analytics.total_sent * 100), 2
                )
            await db.commit()
