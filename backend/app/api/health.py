from fastapi import APIRouter, Depends, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.llm.factory import get_active_provider_status
from app.core.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.APP_ENV
    }

@router.get("/health/live", status_code=status.HTTP_200_OK)
async def liveness_probe():
    return {"status": "alive"}

@router.get("/health/ready", status_code=status.HTTP_200_OK)
async def readiness_probe(db: AsyncSession = Depends(get_db)):
    db_status = "healthy"
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
        
    providers_status = await get_active_provider_status()
    
    is_ready = "healthy" in db_status
    return {
        "status": "ready" if is_ready else "degraded",
        "database": db_status,
        "providers": providers_status
    }
