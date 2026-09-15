# Successful Pattern 002: Ship 30 for 30 Atomic Essay Skill

## Objective
Implement a dedicated writing skill that converts transcript evidence into an authoritative, skimmable ~1,250-word atomic essay following Nicolas Cole & Dickie Bush principles.

## Encoded Writing Principles
1. **The Atomic Hook:** Immediate high-tension opening sentence challenging conventional wisdom.
2. **The 1-3-1 Rhythm:** 1 punchy sentence, 3 short elaboration sentences, 1 concluding sentence.
3. **Scannable Structure:** Clear Markdown `###` subheadings, bullet points, and strategic bolding.
4. **The One Big Takeaway:** A single, actionable closing maxim.

## Implementation Details
- Documented skill specification in `backend/app/skills/ship30/skill.md`.
- Implemented prompt synthesis and automated essay validation in `backend/app/skills/ship30/rules.py`.
- Integrated `Ship30Agent` into router workflow to automatically package essays as Markdown artifacts for the Artifact Viewer.
