# Demo Video Guide & Presentation Script
## Project: The Lenny Growth Assistant (FDE Take-Home Assessment)
**Video Duration:** 2–3 minutes  
**Format:** Screen Recording with Camera Enabled (Loom, OBS, or Zoom)  
**Destination:** YouTube (Unlisted or Public)

---

## 1. Video Timeline & Section Breakdown

```
 ┌──────────────────────┬──────────────────────────────────────────────┐
 │ Time                 │ Section / Action                             │
 ├──────────────────────┼──────────────────────────────────────────────┤
 │ 0:00 – 0:25 (25s)    │ Intro & Problem Framing                      │
 │ 0:25 – 0:55 (30s)    │ Grounded Q&A & Source Citations              │
 │ 0:55 – 1:20 (25s)    │ Multi-Turn Follow-Up & Context Preservation  │
 │ 1:20 – 1:50 (30s)    │ Ship 30 for 30 Essay Generation              │
 │ 1:50 – 2:20 (30s)    │ Interactive HTML Artifact Viewer & Security  │
 │ 2:20 – 2:45 (25s)    │ Local Ollama Demo & Key Technical Trade-off  │
 │ 2:45 – 3:00 (15s)    │ Summary & Conclusion                         │
 └──────────────────────┴──────────────────────────────────────────────┘
```

---

## 2. Word-for-Word Script & Screen Actions

### 0:00 – 0:25 | Introduction & Problem Framing
* **Camera:** Face visible on camera corner; screen shows the Lenny Growth Assistant web application.
* **Spoken Script:**
  > *"Hi everyone, I'm presenting **The Lenny Growth Assistant**, a full-stack AI system built for product and growth teams to turn 150+ hours of Lenny's Podcast transcripts into authoritative, grounded answers, reusable Ship 30 essays, and interactive artifacts without prompt engineering or hallucinations.*
  > *Let's jump into a live demonstration."*

---

### 0:25 – 0:55 | Grounded Q&A & Transcript Citations
* **Action:** Click the prompt pill: *"How did Superhuman approach product-market fit using Rahul Vohra's quantitative survey framework?"*
* **Screen Display:** Fast response appears with structured headings, Sean Ellis 40% threshold, and High-Expectation Customer segmentation. Expand the first citation card to show timestamp `[04:12 - 09:45]` and the exact transcript quote.
* **Spoken Script:**
  > *"Here, our system routes the query through our semantic retrieval layer, finding the exact transcript chunk from Rahul Vohra's episode.*
  > *Notice that every claim is strictly grounded. The assistant cites Rahul Vohra and provides expandable citation badges with exact podcast timestamps and source quotes so the user can verify every single insight."*

---

### 0:55 – 1:20 | Multi-Turn Context Preservation
* **Action:** Type follow-up in chat: *"How did they apply this to prioritize their product roadmap?"*
* **Screen Display:** Assistant recognizes "this" refers to the PMF survey and explains the 50/50 roadmap rule (50% doubling down on happy users, 50% fixing blockers for somewhat disappointed users).
* **Spoken Script:**
  > *"Because our session state persists in PostgreSQL, the assistant preserves conversational context across turns, understanding how Superhuman balanced their roadmap 50/50 based on that survey."*

---

### 1:20 – 1:50 | Ship 30 for 30 Content Engine
* **Action:** Click the **Ship 30 for 30 Essay** quick skill button or type: *"Write a Ship 30 for 30 essay on Elena Verna's B2B product-led growth loops."*
* **Screen Display:** Generated atomic essay renders with an Atomic Hook, 1-3-1 rhythm, bold highlights, scannable headers, and "The One Big Takeaway".
* **Spoken Script:**
  > *"Next, let's see our specialized Ship 30 for 30 skill. Rather than an unstructured one-off prompt, the agent encodes Nicolas Cole and Dickie Bush's exact writing rules—delivering an atomic hook, 1-3-1 pacing, bold highlights, and a ~1,250-word structured essay grounded in Elena Verna's B2B PLG mechanics."*

---

### 1:50 – 2:20 | Interactive Artifact Viewer & Security Sandboxing
* **Action:** Type: *"Create an interactive HTML calculator for the Sean Ellis 40% PMF score."*
* **Screen Display:** Split-pane Artifact Viewer automatically opens on the right. The live calculator renders inside the sandboxed iframe. Change the slider/inputs live (e.g. 60 happy users) to show real-time percentage recalculation. Click the **Code** tab to show source code, then click **Copy** or **Download**.
* **Spoken Script:**
  > *"When the assistant generates interactive components, the Claude-style Artifact Viewer renders them directly beside the chat.*
  > *From a security standpoint, we treat all generated HTML as untrusted: it is executed in an isolated iframe with `sandbox="allow-scripts"` and strict origin isolation without `allow-same-origin`, backed by a Content Security Policy that completely blocks outbound network connections."*

---

### 2:20 – 2:45 | Local Ollama Model & Technical Trade-Off
* **Action:** Point to the top bar model switcher showing the **Ollama Local** emerald indicator.
* **Spoken Script:**
  > *"The entire system runs seamlessly with local Ollama as well as Anthropic Claude via our flexible provider abstraction layer.*
  > *One key architectural trade-off I made was choosing **PostgreSQL with pgvector** instead of deploying a separate standalone vector database like Pinecone.*
  > *Since PostgreSQL was already required for conversation and session persistence, using pgvector consolidated relational ACID transactions and vector similarity search into a single service, drastically reducing operational overhead and deployment friction."*

---

### 2:45 – 3:00 | Conclusion
* **Spoken Script:**
  > *"The application is 100% reproducible with Docker Compose, features a complete automated test suite, and is ready for production evaluation. Thank you!"*

---

## 3. Evaluator Submission Checklist
- [x] Camera enabled and clearly visible.
- [x] High-resolution screen recording (1080p).
- [x] Clear audio commentary.
- [x] Demonstrated local model switcher & Ollama.
- [x] Demonstrated grounded citations, Ship 30 essay, and interactive Artifact Viewer.
- [x] Articulated the PostgreSQL + pgvector technical trade-off.
