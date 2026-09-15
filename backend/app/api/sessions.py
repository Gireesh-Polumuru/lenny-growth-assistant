from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.db.models import SessionModel, MessageModel
from app.schemas.sessions import SessionCreate, SessionSchema, MessageSchema

router = APIRouter(prefix="/api/sessions", tags=["Sessions"])

@router.post("", response_model=SessionSchema, status_code=status.HTTP_201_CREATED)
async def create_session(session_in: SessionCreate, db: AsyncSession = Depends(get_db)):
    session = SessionModel(
        title=session_in.title or "New Conversation",
        session_metadata=session_in.session_metadata or {}
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session

@router.get("", response_model=List[SessionSchema])
async def list_sessions(db: AsyncSession = Depends(get_db)):
    stmt = select(SessionModel).order_by(SessionModel.updated_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{session_id}", response_model=SessionSchema)
async def get_session(session_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(SessionModel).where(SessionModel.id == session_id)
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(session_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(SessionModel).where(SessionModel.id == session_id)
    result = await db.execute(stmt)
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    await db.delete(session)
    await db.commit()
    return None

@router.get("/{session_id}/messages", response_model=List[MessageSchema])
async def get_session_messages(session_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(MessageModel).where(MessageModel.session_id == session_id).order_by(MessageModel.created_at.asc())
    result = await db.execute(stmt)
    return result.scalars().all()
