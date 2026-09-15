from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class SourceCitation(BaseModel):
    title: str
    guest: str
    company: Optional[str] = None
    section: Optional[str] = None
    timestamp: str
    url: Optional[str] = None
    snippet: str
    score: float

class ArtifactResponse(BaseModel):
    id: Optional[str] = None
    type: str  # 'html' | 'markdown' | 'code'
    title: str
    content: str
    language: Optional[str] = "html"
    metadata: Optional[Dict[str, Any]] = None

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="The user query or prompt")
    provider: Optional[str] = Field(default=None, description="Target LLM provider: 'ollama' | 'anthropic' | 'mock'")
    model: Optional[str] = Field(default=None, description="Specific model identifier")

class ChatResponse(BaseModel):
    session_id: str
    message_id: str
    role: str = "assistant"
    answer: str
    sources: List[SourceCitation] = Field(default_factory=list)
    artifact: Optional[ArtifactResponse] = None
    provider: str
    model: str
    latency_ms: Optional[float] = None
