from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.chat import SourceCitation

class MessageSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    session_id: str
    role: str
    content: str
    model: Optional[str] = None
    provider: Optional[str] = None
    sources: List[SourceCitation] = Field(default_factory=list)
    artifact_id: Optional[str] = None
    created_at: datetime
    message_metadata: Optional[Dict[str, Any]] = None

class SessionCreate(BaseModel):
    title: Optional[str] = "New Conversation"
    session_metadata: Optional[Dict[str, Any]] = None

class SessionSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: str
    title: str
    created_at: datetime
    updated_at: datetime
    session_metadata: Optional[Dict[str, Any]] = None
    messages: Optional[List[MessageSchema]] = None
