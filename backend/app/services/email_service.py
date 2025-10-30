# app/services/email_service.py

import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings


async def send_email(to_email: str, subject: str, html_content: str, text_content: str = None):
    """Send email via SMTP"""
    
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = f"{settings.FROM_NAME} <{settings.FROM_EMAIL}>"
    message["To"] = to_email
    
    # Add text and HTML parts
    if text_content:
        part1 = MIMEText(text_content, "plain")
        message.attach(part1)
    
    part2 = MIMEText(html_content, "html")
    message.attach(part2)
    
    try:
        await aiosmtplib.send(
            message,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            start_tls=True
        )
        print(f"✅ Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")
        return False


async def send_verification_email(email: str, token: str):
    """Send email verification link"""
    
    verification_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
    
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Welcome to VBIT Newsletter!</h2>
            <p>Please verify your email address by clicking the link below:</p>
            <p><a href="{verification_url}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email</a></p>
            <p>Or copy this link: {verification_url}</p>
            <p>This link will expire in 24 hours.</p>
        </body>
    </html>
    """
    
    text_content = f"""
    Welcome to VBIT Newsletter!
    
    Please verify your email address by visiting: {verification_url}
    
    This link will expire in 24 hours.
    """
    
    await send_email(email, "Verify Your Email - VBIT Newsletter", html_content, text_content)


async def send_reset_password_email(email: str, token: str):
    """Send password reset link"""
    
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Reset Your Password</h2>
            <p>You requested to reset your password. Click the link below:</p>
            <p><a href="{reset_url}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a></p>
            <p>Or copy this link: {reset_url}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        </body>
    </html>
    """
    
    text_content = f"""
    Reset Your Password
    
    You requested to reset your password. Visit: {reset_url}
    
    This link will expire in 1 hour.
    
    If you didn't request this, please ignore this email.
    """
    
    await send_email(email, "Reset Your Password - VBIT Newsletter", html_content, text_content)


async def send_team_invite_email(email: str, team_name: str, role: str):
    """Send team invitation email"""
    
    invite_url = f"{settings.FRONTEND_URL}/team/accept-invite"
    
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>You've Been Invited!</h2>
            <p>You have been invited to join <strong>{team_name}</strong> as a <strong>{role}</strong>.</p>
            <p><a href="{invite_url}" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Accept Invitation</a></p>
        </body>
    </html>
    """
    
    await send_email(email, f"Invitation to join {team_name}", html_content)
