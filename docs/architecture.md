# Technical Architecture & System Design
## Project: The Lenny Growth Assistant
**Author:** Forward Deployed Engineering (FDE)  
**Date:** September 2026  
**Status:** Approved  
**Version:** 1.0.0

---

## 1. System Architecture Topology

The Lenny Growth Assistant is designed as a decoupled, micro-service ready, 3-tier architecture:

```
┌────────────────────────────────────────────────────────────────────────┐
│               1. Presentation Layer (React 18 + Vite + TS)             │
│  - Session Manager & Chat Thread UI                                    │
│  - Active Model Selector (Ollama Local / Claude 3.5 Sonnet)            │
│  - Split-Pane Sandboxed Artifact Viewer (HTML/CSS & Markdown)          │
│  - Interactive Citation Tracing & Quote Inspector                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP REST & SSE Streaming (JSON)
┌───────────────────────────────────▼────────────────────────────────────┐
│               2. Backend Service Layer (FastAPI + Async Python)        │
│                                                                        │
│  ┌───────────────────────────────┬──────────────────────────────────┐  │
│  │ API Endpoints:                │ Agent & Orchestration Engine:    │  │
│  │ - /health, /health/ready      │ - Agent Router (Intent Analysis) │  │
│  │ - /api/sessions               │ - Grounded Q&A Worker            │  │
│  │ - /api/chat                   │ - Ship 30 for 30 Skill Engine    │  │
│  │ - /api/artifacts              │ - Artifact Generator Worker      │  │
│  │ - /api/models                 │ - Observability & Error Fallback │  │
│  └───────────────────────────────┴──────────────────────────────────┘  │
│                                  │                                     │
│  ┌───────────────────────────────┴──────────────────────────────────┐  │
│  │ Unified LLM Provider Interface:                                  │  │
│  │ - OllamaProvider (Local Ollama: llama3.2 / mistral / qwen2.5)    │  │
│  │ - AnthropicProvider (Claude 3.5 Sonnet / Haiku)                  │  │
│  │ - Resilient Fallback Engine (Offline detection & graceful error) │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ SQLAlchemy Async Engine / pgvector
┌───────────────────────────────────▼────────────────────────────────────┐
│               3. Persistence & Vector Layer (PostgreSQL 16)            │
│  - Relational Schemas: sessions, messages, artifacts, transcripts      │
│  - Vector Embedding Index: transcript_chunks (pgvector 384d / 1536d)   │
│  - Automatic SQLite / Local Vector Fallback for zero-setup dev test    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Database Schema Definition

PostgreSQL with `pgvector` extension is used for both transactional chat persistence and semantic vector retrieval.

### Schema DDL & Models

```sql
-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Sessions Table
CREATE TABLE sessions (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Messages Table
CREATE TABLE messages (
    id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(36) REFERENCES sessions(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    model VARCHAR(100),
    provider VARCHAR(50),
    sources JSONB DEFAULT '[]'::jsonb,
    artifact_id VARCHAR(36),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 3. Transcripts Table
CREATE TABLE transcripts (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    guest VARCHAR(150) NOT NULL,
    company VARCHAR(150),
    episode_url VARCHAR(500),
    source_url VARCHAR(500),
    summary TEXT,
    published_at VARCHAR(50),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 4. Transcript Chunks Table (Vector Store)
CREATE TABLE transcript_chunks (
    id VARCHAR(60) PRIMARY KEY,
    transcript_id VARCHAR(50) REFERENCES transcripts(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(384), -- 384 for standard all-MiniLM / nomic / bge; flexible
    start_timestamp VARCHAR(20),
    end_timestamp VARCHAR(20),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 5. Artifacts Table
CREATE TABLE artifacts (
    id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(36) REFERENCES sessions(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'markdown', 'html', 'code'
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    language VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);
```

---

## 3. Knowledge Ingestion & Retrieval Pipeline

```
Raw Lenny Transcripts (.json / .txt / .md)
                 │
                 ▼
[Ingestion Pipeline (app/rag/ingestion.py)]
   1. Clean & normalize whitespace, guest names, timestamps
   2. Semantic Chunking (500–800 tokens, 100-token overlap, boundary-aware)
   3. Generate Dense Embeddings (local sentence-transformers or Ollama/Anthropic)
   4. Upsert transcripts & chunks with rich metadata into PostgreSQL
                 │
                 ▼
[Query Time Retrieval (app/rag/retrieval.py)]
   1. User Query -> Generate query embedding
   2. Perform Cosine Similarity Search:
      SELECT chunk_index, content, 1 - (embedding <=> :query_vec) AS score
      FROM transcript_chunks WHERE score > 0.45 ORDER BY score DESC LIMIT 5;
   3. Format context with source provenance [Guest | Episode | Timestamp]
   4. Inject into Agent Grounding Prompt
```

---

## 4. Agent Routing & Skill Architecture

The application adopts a clean, deterministic Agent Routing pattern:

```
                  ┌───────────────────────┐
                  │   Incoming Message    │
                  └───────────┬───────────┘
                              │
                  ┌───────────▼───────────┐
                  │     Agent Router      │
                  │ (Intent Classifier)   │
                  └───────────┬───────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  Grounded Q&A    │ │  Ship 30 Skill   │ │ Artifact Skill   │
│  - Strict RAG    │ │  - ~1,250 words  │ │  - HTML/CSS/JS   │
│  - Direct quotes │ │  - Atomic Hook   │ │  - Interactive   │
│  - Provenance    │ │  - 1-3-1 rhythm  │ │  - Sandboxed MD  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

1. **Grounded Q&A Worker:** Answers tactical PM/growth questions strictly using retrieved transcript context. Refuses out-of-domain queries.
2. **Ship 30 for 30 Skill (`app/skills/ship30/`):** Encodes Nicolas Cole & Dickie Bush principles. Enforces structured narrative (~1,250 words), scannable headings, bold key sentences, and single-idea focus.
3. **Artifact Agent (`app/agents/artifact_agent.py`):** Produces standalone, self-contained Markdown specifications or interactive HTML/CSS/JS components (e.g. calculators, frameworks, canvases).

---

## 5. Artifact Sandboxing & Security Model

To prevent Cross-Site Scripting (XSS), data exfiltration, or malicious DOM manipulation from LLM-generated code:

1. **Sandboxed Iframe:** Rendered inside `<iframe sandbox="allow-scripts" srcdoc="..."></iframe>`.
2. **Strict Origin Isolation:** `allow-same-origin` is **intentionally omitted**. This ensures the generated code cannot access `localStorage`, cookies, or execute API calls in the host session context.
3. **Content Security Policy (CSP):** The iframe payload injects `<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' data:; connect-src 'none';">` to block outbound network requests.
4. **HTML Sanitization:** DOMPurify sanitizes Markdown HTML previews to strip forbidden tags (`<script>`, `<iframe>`, `<object>`).

---

## 6. Observability, Logging & Error Resilience

* **Structured JSON Logging:** All incoming requests, LLM latency, retrieval token counts, and error stacks are output as structured logs.
* **Resilience Handlers:**
  - `OllamaUnavailableError`: Returns a clear 503 error instructing the user to start Ollama or switch to Claude.
  - `MissingApiKeyError`: Informs user that cloud credentials are not supplied.
  - `ModelTimeoutError`: Recovers gracefully with a 504 retryable notification.
  - `EmptyRetrievalAlert`: Informs user that the podcast transcripts do not contain relevant coverage for the query.

---

## 7. Deployment Topology

* **Docker Compose:** Orchestrates 3 services:
  1. `frontend`: Node/Nginx container serving the compiled React bundle on port `5173`.
  2. `backend`: Uvicorn/FastAPI container on port `8000`.
  3. `db`: Postgres 16 with `pgvector` on port `5432`.
  4. `ollama` (optional container or host bridge for local GPU acceleration).
