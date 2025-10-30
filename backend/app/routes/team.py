# app/routes/team.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.models.team import Team
from app.models.user import User
from app.schemas.team import TeamCreate, TeamResponse, TeamInviteRequest
from app.core.security import get_current_user_email
from app.services.email_service import send_team_invite_email

router = APIRouter(prefix="/api/team", tags=["Team"])


@router.post("/", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
async def create_team(
    team_data: TeamCreate,
    email: str = Depends(get_current_user_email),
    db: AsyncSession = Depends(get_db)
):
    """Create a new team"""
    
    # Get user
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    new_team = Team(
        name=team_data.name,
        description=team_data.description,
        owner_id=user.id
    )
    
    db.add(new_team)
    await db.commit()
    await db.refresh(new_team)
    
    return new_team


@router.post("/{team_id}/invite", status_code=status.HTTP_200_OK)
async def invite_to_team(
    team_id: int,
    invite_data: TeamInviteRequest,
    email: str = Depends(get_current_user_email),
    db: AsyncSession = Depends(get_db)
):
    """Invite user to team"""
    
    # Get team
    result = await db.execute(select(Team).where(Team.id == team_id))
    team = result.scalar_one_or_none()
    
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Send invitation email
    await send_team_invite_email(invite_data.email, team.name, invite_data.role)
    
    return {"message": f"Invitation sent to {invite_data.email}"}
