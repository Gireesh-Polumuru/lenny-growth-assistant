import re
from typing import List, Dict, Any, Optional
from app.llm.base import BaseLLMProvider, LLMResponse
from app.rag.citations import build_grounded_context_prompt, format_sources_for_response

ARTIFACT_SYSTEM_PROMPT = """You are an expert Frontend Architect and Product Management Tool Builder.
Your job is to convert grounded insights from Lenny's Podcast transcripts into a complete, standalone, production-quality HTML/CSS/JS interactive artifact or structured Markdown document.

CRITICAL GUIDELINES FOR HTML ARTIFACTS:
1. Provide a COMPLETE, self-contained HTML document enclosed in ```html ... ``` code fences.
2. Include internal CSS in <style> tags (modern, beautiful dark theme, glassmorphism, responsive).
3. Include internal JS in <script> tags for interactive functionality (sliders, calculations, tabs, visual charts).
4. Do NOT use external dependencies or external scripts that require internet access.
5. Make the interactive tool highly functional, aesthetic, and directly tied to the transcript concepts (e.g. Sean Ellis PMF calculator, LNO energy matrix, Retention cohort visualizer).
"""

class ArtifactAgent:
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
        
        system_prompt = f"{ARTIFACT_SYSTEM_PROMPT}\n\n=== RELEVANT TRANSCRIPT EVIDENCE ===\n{context_str}"
        
        messages = [{"role": "user", "content": f"Create an interactive HTML/CSS component or structured artifact grounded in the transcripts for: {query}"}]
        
        response: LLMResponse = await self.provider.generate(
            messages=messages,
            system_prompt=system_prompt,
            temperature=0.3,
            max_tokens=4096,
            model_name=model_name
        )
        
        content = response.content
        formatted_sources = format_sources_for_response(retrieved_chunks)
        
        # Extract HTML code if enclosed in code blocks
        html_match = re.search(r"```html\s*(.*?)\s*```", content, re.DOTALL | re.IGNORECASE)
        if html_match:
            artifact_content = html_match.group(1)
            artifact_type = "html"
            language = "html"
        else:
            artifact_content = content
            artifact_type = "markdown"
            language = "markdown"
            
        title_match = re.search(r"<title>(.*?)</title>", artifact_content, re.IGNORECASE)
        if title_match:
            title = title_match.group(1).strip()
        else:
            first_line = content.strip().split("\n")[0].replace("#", "").strip()
            title = first_line[:60] if first_line else "Grounded Growth Artifact"
            
        artifact = {
            "type": artifact_type,
            "title": title,
            "content": artifact_content,
            "language": language,
            "metadata": {
                "generated_from": query,
                "provider": response.provider
            }
        }
        
        return {
            "answer": f"I have generated the interactive artifact: **{title}**. You can interact with it and view the source code in the Artifact Viewer panel on the right.",
            "sources": formatted_sources,
            "artifact": artifact,
            "provider": response.provider,
            "model": response.model,
            "latency_ms": response.latency_ms
        }
