import time
from typing import List, Dict, Any, Optional
import httpx
from app.llm.base import BaseLLMProvider, LLMResponse
from app.core.config import settings
from app.core.logger import logger

class AnthropicProvider(BaseLLMProvider):
    def __init__(self, api_key: Optional[str] = None, default_model: Optional[str] = None):
        self.api_key = api_key or settings.ANTHROPIC_API_KEY
        self.default_model = default_model or settings.ANTHROPIC_MODEL or "claude-3-5-sonnet-20241022"
        self.api_url = "https://api.anthropic.com/v1/messages"
        
    async def is_available(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 5)

    async def generate(
        self,
        messages: List[Dict[str, str]],
        system_prompt: Optional[str] = None,
        temperature: float = 0.3,
        max_tokens: int = 4096,
        model_name: Optional[str] = None
    ) -> LLMResponse:
        if not await self.is_available():
            raise ValueError("Anthropic API key is not configured. Please supply ANTHROPIC_API_KEY in environment or .env.")
            
        model = model_name or self.default_model
        start_time = time.time()
        
        # Format messages for Anthropic (alternating user/assistant)
        formatted_messages = []
        for msg in messages:
            role = msg.get("role", "user")
            if role in ["user", "assistant"]:
                formatted_messages.append({"role": role, "content": msg.get("content", "")})
                
        headers = {
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        
        payload: Dict[str, Any] = {
            "model": model,
            "messages": formatted_messages,
            "max_tokens": max_tokens,
            "temperature": temperature
        }
        if system_prompt:
            payload["system"] = system_prompt
            
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                res = await client.post(self.api_url, headers=headers, json=payload)
                if res.status_code != 200:
                    raise RuntimeError(f"Anthropic API returned HTTP {res.status_code}: {res.text}")
                    
                data = res.json()
                content = ""
                for block in data.get("content", []):
                    if block.get("type") == "text":
                        content += block.get("text", "")
                        
                latency = round((time.time() - start_time) * 1000, 2)
                usage = data.get("usage", {})
                
                return LLMResponse(
                    content=content,
                    provider="anthropic",
                    model=model,
                    prompt_tokens=usage.get("input_tokens"),
                    completion_tokens=usage.get("output_tokens"),
                    latency_ms=latency,
                    raw_response=data
                )
        except httpx.TimeoutException:
            raise TimeoutError(f"Anthropic API request timed out for model {model}.")
        except Exception as e:
            logger.error(f"Anthropic generation error: {str(e)}")
            raise
