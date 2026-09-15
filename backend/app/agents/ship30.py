from typing import List, Dict, Any, Optional
from app.llm.base import BaseLLMProvider, LLMResponse
from app.skills.ship30.rules import build_ship30_prompt, validate_ship30_essay
from app.rag.citations import build_grounded_context_prompt, format_sources_for_response

class Ship30Agent:
    def __init__(self, provider: BaseLLMProvider):
        self.provider = provider

    async def run(
        self,
        query: str,
        retrieved_chunks: List[Dict[str, Any]],
        conversation_history: Optional[List[Dict[str, str]]] = None,
        model_name: Optional[str] = None
    ) -> Dict[str, Any]:
        context_str = build_grounded_context_prompt(retrieved_chunks)
        
        system_prompt = build_ship30_prompt(query, context_str)
        
        messages = [{"role": "user", "content": f"Write a comprehensive Ship 30 for 30 atomic essay (~1,250 words) based on the transcripts regarding: {query}"}]
        
        response: LLMResponse = await self.provider.generate(
            messages=messages,
            system_prompt=system_prompt,
            temperature=0.35,
            max_tokens=4096,
            model_name=model_name
        )
        
        formatted_sources = format_sources_for_response(retrieved_chunks)
        validation = validate_ship30_essay(response.content)
        
        # Package essay as a Markdown artifact for the split-pane viewer
        title_match = response.content.split("\n")[0].replace("#", "").strip() if response.content else "Ship 30 for 30 Essay"
        artifact = {
            "type": "markdown",
            "title": title_match if len(title_match) < 80 else "Ship 30 for 30 Atomic Essay",
            "content": response.content,
            "language": "markdown",
            "metadata": {
                "word_count": validation.get("word_count"),
                "framework": "Ship 30 for 30 Atomic Essay"
            }
        }
        
        return {
            "answer": response.content,
            "sources": formatted_sources,
            "artifact": artifact,
            "provider": response.provider,
            "model": response.model,
            "latency_ms": response.latency_ms,
            "validation": validation
        }
