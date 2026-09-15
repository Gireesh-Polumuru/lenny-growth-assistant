from datetime import datetime
from typing import Dict, Any, Optional
from pydantic import BaseModel, ConfigDict, Field

class ArtifactCreate(BaseModel):
    session_id: str
    type: str  # 'html' | 'markdown' | 'code'
    title: str
    content: str
    language: Optional[str] = "html"
    artifact_metadata: Optional[Dict[str, Any]] = None

class ArtifactSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    session_id: str
    type: str
    title: str
    content: str
    language: Optional[str] = "html"
    created_at: datetime
    artifact_metadata: Optional[Dict[str, Any]] = None
