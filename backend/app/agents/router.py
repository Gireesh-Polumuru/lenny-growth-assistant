import re
from typing import Literal

AgentIntent = Literal["QUESTION", "ESSAY", "ARTIFACT"]

def classify_intent(message: str) -> AgentIntent:
    """
    Deterministically and rapidly classifies user intent to route to the appropriate specialized skill.
    """
    msg_lower = message.lower().strip()
    
    # 1. Artifact / HTML / Component triggers (Check first for tools & interactive widgets)
    artifact_patterns = [
        r"html", r"calculator", r"artifact", r"widget", r"prototype",
        r"component", r"canvas", r"dashboard", r"interactive"
    ]
    if any(re.search(pat, msg_lower) for pat in artifact_patterns):
        # Unless they explicitly ask only for an essay about an artifact
        if "ship 30" not in msg_lower and "write an essay" not in msg_lower and "write a 1250" not in msg_lower:
            return "ARTIFACT"

    # 2. Ship 30 / Essay intent
    essay_triggers = [
        "ship 30", "ship30", "write an essay", "write a 1250", "atomic essay",
        "long-form essay", "essay on", "write an article", "ghostwrite"
    ]
    if any(trigger in msg_lower for trigger in essay_triggers):
        return "ESSAY"
        
    # 3. Default: Grounded Q&A
    return "QUESTION"
