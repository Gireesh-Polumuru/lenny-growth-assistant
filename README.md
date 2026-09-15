# The Lenny Growth Assistant 🚀
### Full-Stack AI-Powered Product & Growth Advisor Grounded in Lenny's Podcast Transcripts

[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-3776AB.svg?style=flat&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 18](https://img.shields.io/badge/React-18.2+-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16_+_pgvector-4169E1.svg?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Ollama](https://img.shields.io/badge/Ollama-Local_LLM-black.svg?style=flat&logo=ollama&logoColor=white)](https://ollama.ai)
[![Tests](https://img.shields.io/badge/Tests-13%20Passed%20(100%25)-success)](https://pytest.org)

A full-stack, forward-deployed AI conversational platform that ingests *Lenny's Podcast* transcripts, provides strictly grounded answers with verifiable timestamp citations, generates ~1,250-word Ship 30 for 30 atomic essays, and renders live interactive HTML/CSS and Markdown artifacts in a sandboxed side-by-side viewer.

---

## 1. System Architecture Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        React 18 + Vite + TypeScript Frontend                           │
│  ┌─────────────────────────────┐   ┌─────────────────────────────────────────────────┐ │
│  │ Chat Thread & History       │   │ Sandboxed Claude-Style Artifact Viewer          │ │
│  │ - Multi-turn persistence    │   │ - Live HTML/CSS Sandboxed IFrame Preview        │ │
│  │ - Expandable Source Citations│   │ - Markdown Document Renderer                    │ │
│  │ - Model Switcher (Ollama/CL)│   │ - Syntax Highlighting & Code Inspector          │ │
│  │ - Skill Shortcut Buttons    │   │ - Export (Download .html / .md & Copy Code)     │ │
│  └──────────────┬──────────────┘   └────────────────────────┬────────────────────────┘ │
└─────────────────┼───────────────────────────────────────────┼──────────────────────────┘
                  │ HTTP REST / JSON                          │
┌─────────────────▼───────────────────────────────────────────▼──────────────────────────┐
│                             FastAPI Backend Service Layer                              │
│                                                                                        │
│  ┌───────────────────────────────┐        ┌──────────────────────────────────────────┐ │
│  │ API Endpoints:                │        │ Agent Orchestration & Routing:           │ │
│  │ • /health, /health/ready      │───────►│ • Agent Router (Intent Classification)   │ │
│  │ • /api/sessions               │        │ • Grounded Q&A Worker                    │ │
│  │ • /api/chat                   │        │ • Ship 30 for 30 Skill Engine            │ │
│  │ • /api/artifacts              │        │ • Artifact Generator Worker              │ │
│  │ • /api/models                 │        │ • Strict Grounding Guardrails            │ │
│  └───────────────────────────────┘        └────────────────────┬─────────────────────┘ │
│                                                                │                       │
│  ┌─────────────────────────────────────────────────────────────▼─────────────────────┐ │
│  │ Multi-LLM Provider Abstraction:                                                   │ │
│  │ • Local Ollama (`llama3.2` / `mistral` / `qwen2.5`)                               │ │
│  │ • Anthropic Claude (`claude-3-5-sonnet-20241022`)                                 │ │
│  │ • Deterministic Fast Mock Engine (for explicit zero-setup testing)                 │ │
│  └──────────────────────────────┬──────────────────────────────┬─────────────────────┘ │
└─────────────────────────────────┼──────────────────────────────┼───────────────────────┘
                                  │                              │
         ┌────────────────────────▼────────┐    ┌────────────────▼─────────────────────┐
         │ PostgreSQL 16 + pgvector        │    │ Lenny's Podcast Knowledge Base       │
         │ • Sessions, Messages, Artifacts │    │ • 7 Landmark Guest Transcripts       │
         │ • Semantic 384d Vector Embeddings│   │ • 15+ Timestamped Sections & Quotes  │
         │ • Automatic SQLite/Local Fallback│   │ • Hybrid Dense Retrieval             │
         └─────────────────────────────────┘    └──────────────────────────────────────┘
```

---

## 2. Key Features

- **Strict Transcript Grounding:** Answers are anchored strictly in podcast transcripts with speaker names, episode titles, and timestamps `[04:12 - 09:45]`. Automatically refuses out-of-domain questions to prevent hallucination.
- **Ship 30 for 30 Writing Skill:** Dedicated agent encoding Dickie Bush & Nicolas Cole atomic essay principles (Atomic Hook, 1-3-1 rhythm, bold scannability, ~1,250 words, "The One Big Takeaway").
- **Claude-Style In-App Artifact Viewer:** Interactive HTML/CSS tools (calculators, frameworks, dashboards) render in a side-by-side split screen.
- **Untrusted Code Sandboxing:** Sandboxed iframe (`sandbox="allow-scripts"` without `allow-same-origin`) with Content Security Policy (CSP) blocking network exfiltration.
- **Explicit LLM Provider Layer:** Real-time UI control between local Ollama, Anthropic Claude, and deterministic mock mode with zero silent fallbacks.
- **Full Multi-Session Persistence:** Multi-turn conversation history and artifacts saved in PostgreSQL.

---

## 3. Quick Start (One-Command Startup)

### Option A: Docker Compose (Recommended)

Ensure Docker is running, then clone and launch:

```bash
git clone https://github.com/Gireesh-Polumuru/lenny-growth-assistant.git
cd lenny-growth-assistant

# 1. Setup environment variables (optional cloud key)
cp .env.example .env

# 2. Launch with Docker Compose
docker compose up --build
```

Access the application:
- **Frontend Web UI:** [http://localhost:5173](http://localhost:5173)
- **Backend API Docs (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check:** [http://localhost:8000/health](http://localhost:8000/health)

> **Note on Docker + Host Ollama:**
> When running inside Docker on Windows/Mac, the backend reaches host-local Ollama via `http://host.docker.internal:11434` (pre-configured in `docker-compose.yml` with `extra_hosts: ["host.docker.internal:host-gateway"]`). Ensure Ollama is running on your host machine.

---

### Option B: Local Direct Execution (Zero-Friction Dev Mode)

#### 1. Backend Setup:
```bash
# Python 3.11+
pip install -r backend/requirements.txt

# Start FastAPI backend (automatically auto-ingests transcripts & initializes DB)
python -m uvicorn app.main:app --app-dir backend --port 8000 --reload
```

#### 2. Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 4. LLM Configuration & Provider Behavior

The system provides **honest, deterministic provider routing** without silent fallbacks:

### A. Local Ollama Setup (Primary Demo Model)
1. Install [Ollama](https://ollama.ai).
2. Pull your model:
   ```bash
   ollama pull llama3.2
   ```
3. Ensure Ollama is running (`ollama serve`). The local backend connects to `http://localhost:11434` (or `http://host.docker.internal:11434` in Docker).
4. **Error Behavior:** If Ollama is selected but offline or unreachable, the system returns an explicit connection error (`503 Service Unavailable: Ollama service unavailable at ...`) rather than silently routing elsewhere.

### B. Anthropic Claude Setup (Cloud Provider)
In your `.env` file, supply your Anthropic API key:
```env
ANTHROPIC_API_KEY=sk-ant-api03-...
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```
* **Error Behavior:** If Claude is selected but no valid `ANTHROPIC_API_KEY` is configured, the system explicitly returns `"Anthropic API key is not configured"` rather than pretending it succeeded or silently switching models.

### C. Deterministic Fast Mock Mode
* Used **only when explicitly selected** in the UI or configuration (`DEFAULT_LLM_PROVIDER=mock`).
* Provides instant deterministic PM answers for testing without requiring local GPU or cloud credentials.

---

## 5. Environment Variables (`.env`)

| Variable | Default | Description |
| :--- | :--- | :--- |
| `APP_ENV` | `development` | `development` / `production` / `test` |
| `DATABASE_URL` | `postgresql+asyncpg://postgres:postgres@db:5432/lenny_assistant` | PostgreSQL connection string (or SQLite fallback) |
| `DEFAULT_LLM_PROVIDER` | `ollama` | `ollama` \| `anthropic` \| `mock` |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | URL of local Ollama instance |
| `OLLAMA_MODEL` | `llama3.2` | Model tag for Ollama |
| `ANTHROPIC_API_KEY` | `""` | Anthropic Claude API Key (optional) |
| `ANTHROPIC_MODEL` | `claude-3-5-sonnet-20241022` | Claude model identifier |
| `FRONTEND_URL` | `http://localhost:5173` | CORS allowed origin |

---

## 6. Running Automated Tests

Run the full pytest suite covering API endpoints, session persistence, vector retrieval, grounding guardrails, Ship 30 skill, and artifact generation:

```bash
python -m pytest backend/tests -v
```

### Test Suite Summary:
```text
backend/tests/test_agents.py::test_intent_router_classification PASSED
backend/tests/test_agents.py::test_ship30_essay_validator PASSED
backend/tests/test_artifacts.py::test_artifact_generation_and_storage PASSED
backend/tests/test_grounding.py::test_grounded_answer_includes_citations PASSED
backend/tests/test_grounding.py::test_out_of_domain_query_handling PASSED
backend/tests/test_health.py::test_health_endpoint PASSED
backend/tests/test_health.py::test_liveness_probe PASSED
backend/tests/test_health.py::test_readiness_probe PASSED
backend/tests/test_persistence.py::test_session_multi_turn_persistence PASSED
backend/tests/test_retrieval.py::test_retrieval_for_superhuman_pmf PASSED
backend/tests/test_retrieval.py::test_retrieval_for_elena_verna_plg PASSED
backend/tests/test_retrieval.py::test_empty_retrieval_for_irrelevant_query PASSED
backend/tests/test_sessions.py::test_session_lifecycle PASSED

============================= 13 passed in 1.60s (100% Pass Rate) =============================
```

---

## 7. Manual UI Test Plan

| Step | Action | Expected Behavior |
| :--- | :--- | :--- |
| **01** | Open [http://localhost:5173](http://localhost:5173) | Main interface loads with header, empty chat state, and discovery prompt pills. |
| **02** | Click Prompt Pill: *"How did Superhuman measure PMF?"* | Grounded answer streams/displays with 40% Sean Ellis benchmark and clickable citation cards. |
| **03** | Expand Citation Card | Reveals episode title, Rahul Vohra guest badge, timestamp `[04:12 - 09:45]`, and verifiable quote. |
| **04** | Ask Follow-Up: *"How did they balance their roadmap?"* | Preserves context and answers with the 50/50 roadmap strategy. |
| **05** | Refresh Browser Page | Session and messages persist cleanly from PostgreSQL. |
| **06** | Click Quick Skill: **Ship 30 for 30 Essay** | Generates ~1,250-word atomic essay with hook, 1-3-1 rhythm, bolding, and "The One Big Takeaway". |
| **07** | Click Quick Skill: **Interactive HTML Tool** | Generates interactive PMF score calculator; Artifact Viewer slides open on the right. |
| **08** | Interact with Calculator | Adjust sliders/inputs; calculator updates score in real time. |
| **09** | Switch to **Code** Tab & Click **Download** | Displays clean HTML source code and downloads `.html` file. |
| **10** | Toggle Model to **Claude 3.5** or **Ollama** | Model indicator updates; requests route to chosen provider. |
| **11** | Stop Ollama / Invalid Key Test | UI displays clear, non-crashing alert with actionable guidance. |

---

## 8. Artifact Security & Sandboxing Strategy

Generated HTML/CSS/JS is treated as **untrusted third-party input**:
1. **Isolated Iframe Sandbox:** Rendered via `<iframe sandbox="allow-scripts" srcdoc="...">`.
2. **Strict Origin Isolation:** `allow-same-origin` is **omitted**, preventing access to host `localStorage`, session cookies, or backend API tokens.
3. **Content Security Policy (CSP):** Payload includes `<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' data:; connect-src 'none';">`, completely blocking external network requests.
4. **Markdown Sanitization:** HTML embedded in Markdown is sanitized via DOMPurify to strip unauthorized tags.

---

## 9. Project Structure

```text
lenny-growth-assistant/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI routers (health, chat, sessions, artifacts, models)
│   │   ├── agents/       # Agent Router, Grounded Q&A, Ship30, Artifact agents
│   │   ├── rag/          # Semantic chunking, embeddings, retrieval, citations, ingestion
│   │   ├── llm/          # Ollama, Anthropic Claude, and Mock provider abstractions
│   │   ├── db/           # SQLAlchemy models and async database engine
│   │   ├── schemas/      # Pydantic v2 validation contracts
│   │   ├── core/         # Settings and structured logger
│   │   └── main.py       # FastAPI application entrypoint
│   ├── tests/            # Pytest test suite (13 automated tests)
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile        # Backend container definition
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Chat, Sidebar, Sources, Artifact Viewer, Header
│   │   ├── services/     # API client functions
│   │   ├── types/        # TypeScript interfaces
│   │   ├── App.tsx       # Main layout and state orchestrator
│   │   └── main.tsx      # React root
│   ├── package.json      # Node dependencies
│   ├── vite.config.ts    # Vite configuration & reverse proxy
│   └── Dockerfile        # Frontend multi-stage Nginx container
│
├── skills/
│   └── ship30_essay/     # Ship 30 for 30 skill definition & prompt rules
│
├── data/
│   ├── transcripts.json  # Curated Lenny Podcast transcript database
│   └── README.md         # Knowledge base inventory
│
├── docs/
│   ├── PRD.md            # Product Requirements Document & Discovery Brief
│   ├── architecture.md   # System architecture, DB schema, and topology
│   └── design.md         # UI/UX design tokens and interaction states
│
├── agent-transcripts/    # Step-by-step engineering logs & failed attempt corrections
├── docker-compose.yml    # One-command orchestration
├── .env.example          # Safe environment variables template
├── run_local.bat         # Windows 1-click startup
├── start.sh              # Unix/Mac startup
└── README.md             # Project documentation
```

---

## 10. Forward Deployed Engineer Handoff

* **Extensibility:** To add new podcast episodes, append entries into `data/transcripts.json` and call `python -m app.rag.ingestion` or restart the backend.
* **Observability:** Structured JSON logs are output with `request_id`, `session_id`, `provider`, `model`, and latency timings.
* **Database Migration:** For enterprise PostgreSQL deployments (e.g. Supabase, Railway, AWS RDS), set `DATABASE_URL` in `.env`.
