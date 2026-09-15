from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class ProviderDetail(BaseModel):
    available: bool
    default_model: str
    base_url: Optional[str] = None
    models: Optional[List[str]] = None
    key_configured: Optional[bool] = None
    description: Optional[str] = None

class ModelsStatusResponse(BaseModel):
    default_provider: str
    providers: Dict[str, ProviderDetail]
