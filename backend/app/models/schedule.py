# app/models/schedule.py

from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class ScheduleStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class Schedule(Base):
    __tablename__ = "schedules"
    
    id = Column(Integer, primary_key=True, index=True)
    newsletter_id = Column(Integer, ForeignKey("newsletters.id"), nullable=False)
    scheduled_for = Column(DateTime(timezone=True), nullable=False)
    status = Column(SQLEnum(ScheduleStatus), default=ScheduleStatus.PENDING)
    cron_expression = Column(String(100), nullable=True)  # e.g., "0 16 * * 5"
    retry_count = Column(Integer, default=0)
    error_message = Column(String(1000), nullable=True)
    executed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    newsletter = relationship("Newsletter", back_populates="schedules")
