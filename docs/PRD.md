# Product Requirements Document (PRD)
## Project: The Lenny Growth Assistant
**Author:** Forward Deployed Engineering (FDE)  
**Date:** September 2026  
**Status:** Approved for Implementation  
**Version:** 1.0.0

---

## 1. Discovery Brief

### 1.1 User & Problem Statement
* **Primary Users:** Product Managers (PMs), Growth Practitioners, Founders, and Product Operations teams.
* **Core Job-to-be-Done (JTBD):** When facing critical product strategy, growth loop, monetization, or retention challenges, users want to extract and operationalize authoritative insights from *Lenny's Podcast* transcripts without manually searching, reading through hours of unstructured text, or guessing prompt engineering techniques.
* **Pain Removed:** 
  1. High cognitive overhead & time spent searching through 150+ hours of podcast audio/transcripts.
  2. LLM hallucinations when asked specific tactical product questions without rigorous source grounding.
  3. Tedious friction in converting high-level audio wisdom into structured, publishable formats (e.g., Ship 30 for 30 atomic essays or interactive product frameworks).

### 1.2 Success Metrics
To evaluate the technical and product efficacy of the forward deployment, we track both product and operational metrics:

| Metric Type | Metric Name | Target | Measurement Method |
| :--- | :--- | :--- | :--- |
| **Product (Primary)** | **Grounded Answer Accuracy Rate** | **≥ 92%** | Verification that claims in responses match retrieved transcript quotes. |
| **Product (Grounding)** | **Citation Coverage** | **≥ 95%** | Percentage of factual claims with attached source attribution (guest, episode, timestamp). |
| **Product (Skill)** | **Ship 30 for 30 Compliance** | **1,250 ± 150 words** | Structured hook, 1-3-1 lead-in rhythm, scannable subheadings, and takeaway adherence. |
| **Operational** | **Local LLM Latency (Ollama)** | **< 3.5s TTFT** | Time to First Token on standard commodity developer laptop. |
| **Operational** | **Session Persistence Reliability** | **100%** | Zero state loss across browser reloads or connection drops. |
| **Engineering** | **Automated Test Pass Rate** | **100%** | Comprehensive pytest coverage across API, RAG, Router, and DB persistence. |

### 1.3 Assumptions & Constraints
Because the initial client brief had open requirements, we made the following calculated assumptions:
1. **Self-Contained Local Demonstration:** Evaluators will run the application locally without requiring paid cloud API keys upfront. A local Ollama instance (e.g., `llama3.2` / `mistral` / `qwen2.5`) is supported out-of-the-box, alongside Anthropic Claude.
2. **PostgreSQL as Unified Datastore:** Rather than introducing external managed vector databases (e.g., Pinecone/Qdrant), PostgreSQL with `pgvector` satisfies both relational session persistence and semantic vector search in a single reliable service.
3. **Strict Grounding Boundary:** If a user asks a question not covered in Lenny's transcripts (e.g., "What is the capital of France?"), the assistant must refuse or explicitly acknowledge insufficient evidence rather than hallucinating from parametric pre-training weights.
4. **Untrusted Artifact Rendering:** Generated HTML/CSS code snippets from LLMs must be treated as untrusted third-party inputs and strictly isolated using an iframe sandbox without `allow-same-origin`.

---

## 2. Scope Decisions

### 2.1 In-Scope (MVP & Evaluator Readiness)
* **Grounded Conversational Chat:** Context-preserving multi-turn dialogues strictly bounded to transcript evidence.
* **Source Attribution:** Interactive citation chips displaying guest name, episode title, timestamp, and verifiable quote snippets.
* **Ship 30 for 30 Content Engine:** Dedicated writing skill encoding Cole & Bush atomic essay principles (~1,250 words, hook, scannable structure, bold emphasis).
* **Artifact Generation & Side-by-Side Viewer:** Live split-screen renderer supporting Markdown and sandboxed HTML/CSS artifacts (Claude Artifacts style).
* **Multi-LLM Switcher:** Seamless UI toggle between local Ollama and Anthropic Claude with graceful offline fallback.
* **Session Persistence:** Full multi-chat session management stored in PostgreSQL.
* **One-Command Setup:** Reproducible `docker-compose.yml` and local startup scripts.
* **Automated Test Suite & Observability:** Pytest test suite, structured JSON logging, and `/health` endpoints.

### 2.2 Out-of-Scope (Deliberate Simplifications & Rationale)
* **User Authentication & RBAC:** Excluded to allow zero-friction evaluator access without registration barriers.
* **Multi-Tenant Enterprise Workspaces:** Excluded to keep persistence logic clean and focused on session state.
* **Native Mobile Apps:** Web-first responsive layout (mobile, tablet, desktop) prioritized for PM workflows.
* **Complex Multi-Vector Service Mesh:** Single PostgreSQL + pgvector setup chosen to prevent unnecessary operational fragility during deployment.

---

## 3. Risks & Trade-Offs

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **LLM Hallucination / Drift** | High | Strict RAG prompt guardrails: "Only make factual claims supported by retrieved context. If insufficient, state it directly." |
| **Local Model (Ollama) Latency / Resource Exhaustion** | Medium | Configurable chunk limits (Top-K = 5), streaming response support, and graceful error alerts if Ollama is offline. |
| **Untrusted Code Injection (XSS in Artifacts)** | High | Sandboxed iframe (`sandbox="allow-scripts"` without `allow-same-origin`), Content Security Policy (CSP), and DOMPurify sanitization. |
| **Database Connection Failure** | Medium | Robust SQLAlchemy connection pooling, retries, and user-friendly error boundaries. |

---

## 4. Key User Flows

### Flow 1: Grounded Growth Inquiry
1. User enters: *"How did Superhuman approach finding product-market fit?"*
2. System routes to **Grounded Q&A** agent.
3. System generates embedding, queries `pgvector` for top transcript chunks (Rahul Vohra episode).
4. LLM formulates response with inline citation tags `[Rahul Vohra - Superhuman]`.
5. UI displays structured answer with clickable source cards revealing exact timestamps and quotes.

### Flow 2: Ship 30 for 30 Essay Creation
1. User enters: *"Write a Ship 30 for 30 essay on Elena Verna's B2B product-led growth loops."*
2. Router recognizes **Ship 30 Skill** intent.
3. System retrieves Elena Verna transcript chunks.
4. Skill enforces the 1,250-word atomic essay template (Atomic Hook, 1-3-1 rhythm, core framework, bold takeaways).
5. Output renders formatted in chat and triggers the side-by-side Artifact Viewer.

### Flow 3: Interactive Artifact Generation
1. User enters: *"Create an interactive HTML/CSS calculator for calculating PMF retention cohort curve based on Brian Balfour's advice."*
2. Router dispatches **Artifact Agent**.
3. Agent returns structured HTML/CSS with JavaScript logic.
4. Artifact Viewer opens on right panel; sandboxed iframe renders the calculator live, allowing user to interact, inspect code, or copy.

---

## 5. Acceptance Criteria

- [x] **AC-1 (Grounding):** Answers cite source episodes with timestamps and refuse out-of-domain queries.
- [x] **AC-2 (Persistence):** Multiple chat sessions can be created, switched, and persisted across reloads.
- [x] **AC-3 (Ship 30 Skill):** Generates ~1,250-word atomic essays adhering to the exact writing rules.
- [x] **AC-4 (Artifacts):** Renders Markdown & interactive HTML/CSS in an isolated split-pane viewer.
- [x] **AC-5 (LLM Flexibility):** Seamlessly toggles between local Ollama and Anthropic Claude.
- [x] **AC-6 (Resilience):** Handles missing API keys or offline Ollama gracefully with clear user feedback.
- [x] **AC-7 (Deployment):** Starts reliably with `docker compose up` and includes complete test suite.
