from typing import List, Dict, Any, Optional
from app.llm.base import BaseLLMProvider, LLMResponse
from app.rag.citations import build_grounded_context_prompt, format_sources_for_response
from app.core.logger import logger

GROUNDED_QA_SYSTEM_PROMPT = """You are "The Lenny Growth Assistant", an authoritative product management and growth advisor powered strictly by Lenny's Podcast transcripts.

CORE GROUNDING RULES:
1. Ground every claim STRICTLY in the provided transcript evidence below.
2. If the user asks a question that is NOT answered or supported by the provided transcript evidence, state clearly and politely:
   "I could not find sufficient information in the available Lenny's Podcast transcripts to answer that question reliably."
3. DO NOT hallucinate facts, metrics, or frameworks from general outside knowledge.
4. Always cite specific podcast guests and episodes (e.g. "According to Rahul Vohra on Lenny's Podcast...") and include relevant timestamp quotes.
5. Format your answers clearly with Markdown headers, bold highlights, and bullet points for readability.
"""

# Recognized product & growth domain terms for guardrail validation
PM_DOMAINS = [
    "product", "growth", "pmf", "market", "retention", "pricing", "loop", "customer",
    "lno", "superhuman", "elena", "balfour", "shreyas", "cagan", "metric", "rahul", "vohra",
    "framework", "saas", "b2b", "onboarding", "user", "churn", "cac", "ltv", "plg",
    "monetiz", "experiment", "discovery", "roadmap", "feature", "team", "engineer", "lead",
    "podcast", "lenny", "interview", "episode", "madhavan", "ramanujam", "claire", "vo",
    "chatprd", "strategy", "sales", "pql", "nps", "hook", "viral", "activation", "okr", "burnout"
]

GREETINGS = ["hi", "hello", "hey", "who are you", "what can you do", "help", "how does this work", "what is this", "start", "good morning", "good afternoon", "good evening", "hi there"]

class GroundedQAAgent:
    def __init__(self, provider: BaseLLMProvider):
        self.provider = provider

    async def run(
        self,
        query: str,
        retrieved_chunks: List[Dict[str, Any]],
        conversation_history: Optional[List[Dict[str, str]]] = None,
        model_name: Optional[str] = None
    ) -> Dict[str, Any]:
        import re
        q_clean = query.strip().lower()
        q_words = re.findall(r'\b[a-z0-9]+\b', q_clean)
        
        is_greeting = any(w in ["hi", "hello", "hey", "help", "start", "greetings"] for w in q_words) and len(q_words) <= 8
        is_intro = any(phrase in q_clean for phrase in ["what can you do", "who are you", "how does this work", "what is this", "tell me about", "what episodes", "list episodes"])
        
        # Check for conversational greeting / intro queries
        if is_greeting or is_intro:
            formatted_sources = format_sources_for_response(retrieved_chunks[:2]) if retrieved_chunks else []
            return {
                "answer": "👋 Hello! I am **The Lenny Growth Assistant**, an AI product & growth intelligence partner grounded strictly in **Lenny's Podcast transcripts**.\n\nHere are some high-leverage inquiries you can explore:\n\n1. **Product-Market Fit Engine & 40% Metric** (*Rahul Vohra, Superhuman*)\n2. **B2B Product-Led Growth & PQL Mechanics** (*Elena Verna, Miro/Amplitude*)\n3. **The Four Fits Framework** (*Brian Balfour, Reforge*)\n4. **The LNO Prioritization Framework** (*Shreyas Doshi, Stripe*)\n5. **Empowered Product Teams vs Feature Factories** (*Marty Cagan, SVPG*)\n6. **Monetization & Willingness to Pay** (*Madhavan Ramanujam, Simon-Kucher*)\n\nYou can also prompt me to:  \n- ✍️ *\"Write a Ship 30 for 30 essay on...\"*  \n- ⚡ *\"Create an interactive HTML framework artifact for...\"*\n\nHow can I help your product strategy today?",
                "sources": formatted_sources,
                "artifact": None,
                "provider": "growth_assistant",
                "model": "grounded_guide",
                "latency_ms": 15.0
            }

        top_score = retrieved_chunks[0].get("score", 0.0) if retrieved_chunks else 0.0
        has_pm_context = any(term in q_clean for term in PM_DOMAINS)
        
        # Guardrail: Check if evidence is missing or query is out-of-domain
        # If no PM domain keywords are present and top score is below high relevance threshold (0.50), reject query
        if not retrieved_chunks or (not has_pm_context and top_score < 0.52):
            return {
                "answer": "I could not find sufficient information in the available Lenny's Podcast transcripts to answer that question reliably. You can ask me about topics like Product-Market Fit (Rahul Vohra), B2B PLG & PQLs (Elena Verna), the Four Fits Framework (Brian Balfour), or PM Prioritization (Shreyas Doshi).",
                "sources": [],
                "artifact": None,
                "provider": "grounding_guard",
                "model": "grounding_filter",
                "latency_ms": 10.0
            }
            
        context_str = build_grounded_context_prompt(retrieved_chunks)
        system_prompt = f"{GROUNDED_QA_SYSTEM_PROMPT}\n\n=== RELEVANT TRANSCRIPT EVIDENCE ===\n{context_str}"
        
        messages = []
        if conversation_history:
            messages.extend(conversation_history[-6:])
        messages.append({"role": "user", "content": query})
        
        response: LLMResponse = await self.provider.generate(
            messages=messages,
            system_prompt=system_prompt,
            temperature=0.2,
            model_name=model_name
        )
        
        formatted_sources = format_sources_for_response(retrieved_chunks)
        
        return {
            "answer": response.content,
            "sources": formatted_sources,
            "artifact": None,
            "provider": response.provider,
            "model": response.model,
            "latency_ms": response.latency_ms
        }
