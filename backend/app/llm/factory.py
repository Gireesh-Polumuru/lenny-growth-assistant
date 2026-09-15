from typing import Optional, Dict, Any, List
from app.llm.base import BaseLLMProvider
from app.llm.ollama import OllamaProvider
from app.llm.anthropic import AnthropicProvider
from app.llm.mock_engine import MockLLMProvider
from app.core.config import settings
from app.core.logger import logger

_ollama_instance = None
_anthropic_instance = None
_mock_instance = None

def get_llm_provider(provider_name: Optional[str] = None) -> BaseLLMProvider:
    """Returns the requested LLM provider or fallback instance."""
    global _ollama_instance, _anthropic_instance, _mock_instance
    
    target_provider = (provider_name or settings.DEFAULT_LLM_PROVIDER).lower()
    
    if target_provider == "anthropic":
        if _anthropic_instance is None:
            _anthropic_instance = AnthropicProvider()
        return _anthropic_instance
        
    elif target_provider == "ollama":
        if _ollama_instance is None:
            _ollama_instance = OllamaProvider()
        return _ollama_instance
        
    elif target_provider == "mock":
        if _mock_instance is None:
            _mock_instance = MockLLMProvider()
        return _mock_instance
        
    # Default: Ollama
    if _ollama_instance is None:
        _ollama_instance = OllamaProvider()
    return _ollama_instance

async def get_active_provider_status() -> Dict[str, Any]:
    """Inspects provider availability for UI status badges."""
    ollama = OllamaProvider()
    anthropic = AnthropicProvider()
    
    ollama_ok = await ollama.is_available()
    ollama_models = await ollama.get_available_models() if ollama_ok else []
    anthropic_ok = await anthropic.is_available()
    
    return {
        "default_provider": settings.DEFAULT_LLM_PROVIDER,
        "providers": {
            "ollama": {
                "available": ollama_ok,
                "base_url": settings.OLLAMA_BASE_URL,
                "default_model": settings.OLLAMA_MODEL,
                "models": ollama_models
            },
            "anthropic": {
                "available": anthropic_ok,
                "default_model": settings.ANTHROPIC_MODEL,
                "key_configured": bool(settings.ANTHROPIC_API_KEY)
            },
            "mock": {
                "available": True,
                "default_model": "mock-pm-engine",
                "description": "High-fidelity local deterministic engine for testing"
            }
        }
    }
