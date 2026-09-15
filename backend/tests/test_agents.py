import pytest
from app.agents.router import classify_intent
from app.skills.ship30.rules import validate_ship30_essay

def test_intent_router_classification():
    assert classify_intent("How does Elena Verna define B2B PLG?") == "QUESTION"
    assert classify_intent("Write a Ship 30 for 30 essay on product-led growth") == "ESSAY"
    assert classify_intent("Write an essay on Superhuman PMF") == "ESSAY"
    assert classify_intent("Create an interactive HTML calculator for PMF") == "ARTIFACT"
    assert classify_intent("Generate HTML component for retention cohort") == "ARTIFACT"

def test_ship30_essay_validator():
    sample_essay = (
        "# The PMF Secret\n\n"
        "**Most founders fail.**\n\n"
        "They build without measuring.\n\n"
        "### Step 1: The Sean Ellis Metric\n"
        "- Ask users how they feel.\n"
        "- Target **40% 'Very disappointed'**.\n\n"
        "### The One Big Takeaway\n"
        "Measure weekly."
    )
    result = validate_ship30_essay(sample_essay)
    assert result["has_hook"] is True
    assert result["has_headers"] is True
    assert result["has_bullets"] is True
    assert result["has_bolding"] is True
    assert result["is_valid_ship30"] is True
