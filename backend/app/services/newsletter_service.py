# app/services/newsletter_service.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.newsletter import Newsletter
from app.models.user import User
from app.models.subscriber import Subscriber
from app.services.email_service import send_email
import asyncio


async def generate_newsletter_content(email: str, db: AsyncSession):
    """Generate AI-powered newsletter content (placeholder)"""
    
    # Get user
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    if not user:
        return None
    
    # TODO: Implement AI content generation
    # For now, create a placeholder newsletter
    
    placeholder_html = """
    <html>
        <body style="font-family: Arial, sans-serif;">
            <h1>AI-Generated Newsletter</h1>
            <p>This is a placeholder for AI-generated content.</p>
        </body>
    </html>
    """
    
    new_newsletter = Newsletter(
        title="AI-Generated Newsletter",
        subject="Your Weekly AI Newsletter",
        content_html=placeholder_html,
        author_id=user.id,
        status="draft"
    )
    
    db.add(new_newsletter)
    await db.commit()
    await db.refresh(new_newsletter)
    
    print(f"✅ Newsletter generated: {new_newsletter.id}")
    return new_newsletter.id


async def send_newsletter_to_subscribers(newsletter_id: int, db: AsyncSession):
    """Send newsletter to all subscribers"""
    
    # Get newsletter
    result = await db.execute(
        select(Newsletter).where(Newsletter.id == newsletter_id)
    )
    newsletter = result.scalar_one_or_none()
    
    if not newsletter:
        return False
    
    # Get all active subscribers
    result = await db.execute(
        select(Subscriber).where(Subscriber.is_subscribed == True)
    )
    subscribers = result.scalars().all()
    
    # Send emails asynchronously
    tasks = []
    for subscriber in subscribers:
        task = send_email(
            subscriber.email,
            newsletter.subject,
            newsletter.content_html,
            newsletter.content_text
        )
        tasks.append(task)
    
    # Wait for all emails to be sent
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    success_count = sum(1 for r in results if r is True)
    print(f"✅ Newsletter sent to {success_count}/{len(subscribers)} subscribers")
    
    return True
