import asyncio
from app.database import AsyncSessionLocal
from app.models.user import User, UserRole
from app.core.security import hash_password

async def create_test_user():
    async with AsyncSessionLocal() as db:
        # Create user
        user = User(
            email="test@vbit.edu",
            full_name="Test User",
            password_hash=hash_password("testpass123"),
            role=UserRole.USER,
            is_verified=True,
            is_active=True
        )
        db.add(user)
        await db.commit()
        print("✅ User created: test@vbit.edu / testpass123")

asyncio.run(create_test_user())
