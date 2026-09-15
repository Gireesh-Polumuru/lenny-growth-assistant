# Successful Pattern 001: Strict Transcript Grounding & Provenance Tracing

## Objective
Build a deterministic RAG retrieval pipeline that extracts high-signal podcast quotes and generates citations with guest names, episode titles, and timestamp tags.

## Architecture & Implementation
1. Structured raw transcripts with timestamped sections in `data/transcripts.json`.
2. Semantic chunker in `app/rag/chunking.py` splits transcripts into 250-word windows with 40-word overlap, prefixing each with guest and timestamp provenance.
3. Dense embeddings generated via `sentence-transformers/all-MiniLM-L6-v2` with cosine similarity retrieval.
4. Prompt injector in `app/rag/citations.py` formats chunks into explicit numbered sources `[SOURCE N: Guest | Episode | Timestamp]` and enforces that the LLM only uses evidence from those blocks.

## Outcome
Responses accurately attribute concepts (e.g. Sean Ellis 40% benchmark to Rahul Vohra, PQL thresholds to Elena Verna) and render clickable citation cards in the frontend.
