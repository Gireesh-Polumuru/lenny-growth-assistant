from fastapi import APIRouter
from app.llm.factory import get_active_provider_status
from app.schemas.models import ModelsStatusResponse

router = APIRouter(prefix="/api/models", tags=["Models"])

@router.get("", response_model=ModelsStatusResponse)
async def get_models_status():
    status_data = await get_active_provider_status()
    return status_data
