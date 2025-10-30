# app/routes/admin.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.user import User, UserRole
from app.core.security import get_current_user_email

router = APIRouter(prefix="/api/admin", tags=["Admin"])


async def verify_admin(email: str = Depends(get_current_user_email), db: AsyncSession = Depends(get_db)):
    """Verify user is admin"""
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    if not user or user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return user


@router.get("/dashboard")
async def get_admin_dashboard(
    admin: User = Depends(verify_admin),
    db: AsyncSession = Depends(get_db)
):
    """Get admin dashboard data"""
    
    # Count users
    result = await db.execute(select(func.count(User.id)))
    total_users = result.scalar() or 0
    
    # Count active users
    result = await db.execute(
        select(func.count(User.id)).where(User.is_active == True)
    )
    active_users = result.scalar() or 0
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "admin_email": admin.email
    }


@router.get("/users")
async def get_all_users(
    admin: User = Depends(verify_admin),
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """Get all users (admin only)"""
    
    result = await db.execute(
        select(User)
        .offset(skip)
        .limit(limit)
        .order_by(User.created_at.desc())
    )
    users = result.scalars().all()
    
    return [
        {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active,
            "is_verified": user.is_verified,
            "created_at": user.created_at
        }
        for user in users
    ]
