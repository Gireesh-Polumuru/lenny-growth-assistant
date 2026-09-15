# Failed Attempt 003: Out-of-Domain Retrieval Guardrail Calibration

## Context
Assessment requirement AC-1 specifies that the assistant must acknowledge when the available transcript material does not support an answer (strict grounding boundary).

## Problem / Error Encountered
When testing query: *"What is the capital city of France and its history?"*, the system returned a general answer instead of triggering the grounding refusal.
```text
FAILED backend/tests/test_grounding.py::test_out_of_domain_query_handling - AssertionError
```

## Diagnosis
1. In the fallback deterministic TF-hash embedding space, random dense vector collisions between common English words created an artificial similarity score of `~0.428`.
2. The agent's threshold check was set at `0.22`, which allowed out-of-domain queries to pass into the synthesis prompt.

## Correction
1. Implemented a dual-stage grounding guardrail in `GroundedQAAgent`:
   - Stage 1: Domain relevance verification against product/growth taxonomy (`PM_DOMAINS`).
   - Stage 2: Heightened minimum confidence threshold for non-domain queries (`score >= 0.50`).
2. If neither condition is met, the agent immediately returns the explicit insufficient-evidence response without hallucination.

## Result
`test_out_of_domain_query_handling` passed with 100% precision.
