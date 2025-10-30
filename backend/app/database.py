# app/database.py

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings


# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)


# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)


# Base class for models
Base = declarative_base()



# Dependency for routes
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()



# Initialize database
async def init_db():
    # Import all models here to ensure they're registered
    from app.models import user, newsletter, article, template, schedule, subscriber, team, analytics
    
    async with engine.begin() as conn:
        # ONLY create tables, DO NOT DROP (preserve data!)
        await conn.run_sync(Base.metadata.create_all)
    
    print("✅ Database initialized successfully")
