# app/models/__init__.py

from app.models.user import User
from app.models.template import Template
from app.models.newsletter import Newsletter
from app.models.article import Article
from app.models.subscriber import Subscriber
from app.models.team import Team
from app.models.schedule import Schedule
from app.models.analytics import Analytics

__all__ = [
    "User",
    "Template", 
    "Newsletter",
    "Article",
    "Subscriber",
    "Team",
    "Schedule",
    "Analytics"
]
