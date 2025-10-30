# app/models/newsletter.py

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class NewsletterStatus(str, enum.Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    SENT = "sent"
    ARCHIVED = "archived"


class Newsletter(Base):
    __tablename__ = "newsletters"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    subject = Column(String(500), nullable=False)
    content_html = Column(Text, nullable=False)
    content_text = Column(Text, nullable=True)
    status = Column(SQLEnum(NewsletterStatus), default=NewsletterStatus.DRAFT)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    template_id = Column(Integer, ForeignKey("templates.id"), nullable=True)
    scheduled_for = Column(DateTime(timezone=True), nullable=True)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    author = relationship("User", back_populates="newsletters")
    template = relationship("Template", back_populates="newsletters")
    schedules = relationship("Schedule", back_populates="newsletter")
    analytics = relationship("Analytics", back_populates="newsletter")
