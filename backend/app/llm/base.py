from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional, AsyncGenerator
from pydantic import BaseModel

class LLMResponse(BaseModel):
    content: str
    provider: str
    model: str
    prompt_tokens: Optional[int] = None
    completion_tokens: Optional[int] = None
    latency_ms: Optional[float] = None
    raw_response: Optional[Dict[str, Any]] = None

class BaseLLMProvider(ABC):
    @abstractmethod
    async def generate(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.3,
        max_tokens: int = 4096,
        model_name: Optional[str] = None
    ) -> LLMResponse:
        """Generates a complete response from the LLM."""
        pass
        
    @abstractmethod
    async def is_available(self) -> bool:
        """Checks if the provider is currently reachable and configured."""
        pass
