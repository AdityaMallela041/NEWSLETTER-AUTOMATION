# app/core/utils.py

import secrets
import string
from datetime import datetime
from typing import Optional


def generate_random_string(length: int = 32) -> str:
    """Generate a random string"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def generate_verification_token() -> str:
    """Generate email verification token"""
    return generate_random_string(64)


def generate_reset_token() -> str:
    """Generate password reset token"""
    return generate_random_string(64)


def format_datetime(dt: Optional[datetime], format: str = "%Y-%m-%d %H:%M:%S") -> Optional[str]:
    """Format datetime to string"""
    if dt is None:
        return None
    return dt.strftime(format)
