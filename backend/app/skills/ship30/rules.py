import re
from typing import Dict, Any

SHIP30_SYSTEM_PROMPT = """You are an elite Product Management Ghostwriter and Ship 30 for 30 Essay Specialist.
Your job is to transform grounded knowledge from Lenny's Podcast transcripts into a comprehensive, authoritative, Ship 30 for 30-style long-form atomic essay (~1,250 words).

You MUST strictly adhere to the following Ship 30 for 30 writing principles:

1. THE ATOMIC HOOK:
   - Start immediately with a bold, high-tension statement challenging a conventional PM mistake.
   - Example: "Most founders treat product-market fit like magic. They are wrong."
   - Follow with the 1-3-1 lead-in rhythm (1 standalone sentence, 3 short sentences of context/stakes, 1 transition punchline).

2. VISUAL SCANNABILITY:
   - Use Markdown headers (### Header) for every major section.
   - Use bullet points for steps and mechanisms.
   - Use SELECTIVE BOLDING on every key insight, rule, and number. A reader scanning only the bold text should understand the full thesis.

3. DETAILED NARRATIVE PROGRESSION:
   - Break down the concept into 3 to 4 actionable pillars or steps.
   - Go deep into the tactical mechanics: explain the *how*, the *why*, and the *formulas/thresholds*.
   - Aim for an extensive, rich guide (~1,250 words).

4. STRICT TRANSCRIPT GROUNDING:
   - Ground all claims, quotes, numbers, and frameworks strictly in the provided transcript evidence.
   - Explicitly cite the guest name and podcast episode.
   - If the transcript lacks specific data, do not invent it.

5. THE ONE BIG TAKEAWAY:
   - Close the essay with a memorable "The One Big Takeaway" section.
"""

def build_ship30_prompt(topic: str, context: str) -> str:
    return (
        f"{SHIP30_SYSTEM_PROMPT}\n\n"
        f"=== TRANSCRIPT EVIDENCE ===\n"
        f"{context}\n\n"
        f"=== USER REQUEST ===\n"
        f"Write a Ship 30 for 30 essay on: {topic}\n\n"
        f"Generate the complete essay now:"
    )

def validate_ship30_essay(text: str) -> Dict[str, Any]:
    """Validates structural compliance of a generated Ship 30 essay."""
    words = text.split()
    word_count = len(words)
    has_hook = bool(re.search(r"^#\s+|^\*\*", text.strip()))
    has_headers = len(re.findall(r"^###?\s+", text, re.MULTILINE)) >= 2
    has_bullets = bool(re.search(r"^\s*[\-\*]\s+", text, re.MULTILINE))
    has_bolding = bool(re.search(r"\*\*[^*]+\*\*", text))
    has_takeaway = "takeaway" in text.lower() or "big takeaway" in text.lower() or "conclusion" in text.lower()
    
    return {
        "word_count": word_count,
        "is_approx_length": 300 <= word_count <= 2500,
        "has_hook": has_hook,
        "has_headers": has_headers,
        "has_bullets": has_bullets,
        "has_bolding": has_bolding,
        "has_takeaway": has_takeaway,
        "is_valid_ship30": has_headers and has_bolding
    }
