# Agent Transcripts & Architectural Iterations

This directory documents the step-by-step development logs, architectural design iterations, failed attempts, diagnoses, and corrections made during the forward deployment engineering of **The Lenny Growth Assistant**.

---

## Structure

```
agent_transcripts/
├── successful/
│   ├── 001_initial_rag_and_grounding.md
│   ├── 002_ship30_skill_implementation.md
│   └── 003_artifact_viewer_and_security.md
│
└── failed_attempts/
    ├── 001_sqlalchemy_metadata_reserved_attribute_collision.md
    ├── 002_pytest_asyncio_fixture_strict_mode.md
    └── 003_out_of_domain_similarity_threshold.md
```

---

## Engineering Decision Log Summary

1. **PostgreSQL + pgvector vs. Standalone Vector Database:** Evaluated Pinecone/Qdrant vs. Postgres. Chose PostgreSQL with `pgvector` to consolidate transactional session persistence and semantic embeddings into a single, highly operable database.
2. **Deterministic Fallback Engine:** Built an embedded offline engine alongside Ollama and Anthropic Claude so evaluators on fresh environments can test immediately with zero credential friction.
3. **Sandboxed Artifact Security:** Designed an isolated iframe architecture with `sandbox="allow-scripts"` (strictly omitting `allow-same-origin`) and Content Security Policy (CSP) headers to neutralize untrusted code execution risks.
