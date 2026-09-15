from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.db.models import ArtifactModel
from app.schemas.artifacts import ArtifactCreate, ArtifactSchema

router = APIRouter(prefix="/api/artifacts", tags=["Artifacts"])

@router.post("", response_model=ArtifactSchema, status_code=status.HTTP_201_CREATED)
async def create_artifact(artifact_in: ArtifactCreate, db: AsyncSession = Depends(get_db)):
    artifact = ArtifactModel(
        session_id=artifact_in.session_id,
        type=artifact_in.type,
        title=artifact_in.title,
        content=artifact_in.content,
        language=artifact_in.language or "html",
        artifact_metadata=artifact_in.artifact_metadata or {}
    )
    db.add(artifact)
    await db.commit()
    await db.refresh(artifact)
    return artifact

@router.get("/{artifact_id}", response_model=ArtifactSchema)
async def get_artifact(artifact_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(ArtifactModel).where(ArtifactModel.id == artifact_id)
    result = await db.execute(stmt)
    artifact = result.scalar_one_or_none()
    if not artifact:
        raise HTTPException(status_code=404, detail="Artifact not found")
    return artifact

@router.get("/session/{session_id}", response_model=List[ArtifactSchema])
async def list_session_artifacts(session_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(ArtifactModel).where(ArtifactModel.session_id == session_id).order_by(ArtifactModel.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()
