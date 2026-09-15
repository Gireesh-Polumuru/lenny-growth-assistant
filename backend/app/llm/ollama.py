import time
from typing import List, Dict, Any, Optional
import httpx
from app.llm.base import BaseLLMProvider, LLMResponse
from app.core.config import settings
from app.core.logger import logger

class OllamaProvider(BaseLLMProvider):
    def __init__(self, base_url: Optional[str] = None, default_model: Optional[str] = None):
        self.base_url = (base_url or settings.OLLAMA_BASE_URL).rstrip("/")
        self.default_model = default_model or settings.OLLAMA_MODEL or "llama3.2:latest"
        self.timeout = settings.OLLAMA_TIMEOUT_SECONDS
        
    async def is_available(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=httpx.Timeout(2.0, connect=1.0)) as client:
                res = await client.get(f"{self.base_url}/api/tags")
                return res.status_code == 200
        except Exception:
            return False

    async def get_available_models(self) -> List[str]:
        try:
            async with httpx.AsyncClient(timeout=httpx.Timeout(2.0, connect=1.0)) as client:
                res = await client.get(f"{self.base_url}/api/tags")
                if res.status_code == 200:
                    data = res.json()
                    return [m.get("name") for m in data.get("models", [])]
        except Exception as e:
            logger.warning(f"Failed to fetch Ollama models: {e}")
        return []

    async def generate(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.3,
        max_tokens: int = 4096,
        model_name: Optional[str] = None
    ) -> LLMResponse:
        model = model_name or self.default_model
        start_time = time.time()
        
        formatted_messages = []
        if system_prompt:
            formatted_messages.append({"role": "system", "content": system_prompt})
        formatted_messages.extend(messages)
        
        payload = {
            "model": model,
            "messages": formatted_messages,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens
            }
        }
        
        # Fast 2-second connect timeout so offline Ollama fails over immediately
        client_timeout = httpx.Timeout(self.timeout, connect=2.0)
        
        try:
            async with httpx.AsyncClient(timeout=client_timeout) as client:
                res = await client.post(f"{self.base_url}/api/chat", json=payload)
                if res.status_code != 200:
                    raise RuntimeError(f"Ollama API returned HTTP {res.status_code}: {res.text}")
                
                data = res.json()
                content = data.get("message", {}).get("content", "")
                latency = round((time.time() - start_time) * 1000, 2)
                
                return LLMResponse(
                    content=content,
                    provider="ollama",
                    model=model,
                    prompt_tokens=data.get("prompt_eval_count"),
                    completion_tokens=data.get("eval_count"),
                    latency_ms=latency,
                    raw_response=data
                )
        except (httpx.ConnectError, httpx.ConnectTimeout):
            raise ConnectionError(f"Ollama service unavailable at {self.base_url}. Please ensure Ollama is running.")
        except httpx.TimeoutException:
            raise TimeoutError(f"Ollama request timed out after {self.timeout}s for model {model}.")
        except Exception as e:
            logger.error(f"Ollama generation error: {str(e)}")
            raise
