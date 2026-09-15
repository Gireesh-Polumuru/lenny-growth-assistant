# Knowledge Base: Lenny's Podcast Transcripts

This directory contains curated and verified transcript segments from landmark episodes of **Lenny's Podcast**, structured for high-precision semantic chunking and source attribution.

---

## 1. Episode Inventory & Grounding Coverage

| Guest | Topic / Framework | Landmark Takeaways | Ingestion ID |
| :--- | :--- | :--- | :--- |
| **Rahul Vohra** | Superhuman PMF Engine | Sean Ellis 40% threshold, HXC customer segmentation, 50/50 roadmap balance | `rahul-vohra-pmf` |
| **Elena Verna** | B2B Product-Led Growth | Bottom-up adoption, 3–5 min Aha! moment, PQL thresholds, viral collaboration loops | `elena-verna-b2b-plg` |
| **Brian Balfour** | Four Fits Framework | Market-Product, Product-Channel, Channel-Model, Model-Market; Retention cohort curves | `brian-balfour-four-fits` |
| **Shreyas Doshi** | LNO Task Prioritization | L (10x leverage, 100% effort), N (neutral, 80%), O (overhead, 50%); High agency PMing | `shreyas-doshi-pm-craft` |
| **Marty Cagan** | Empowered Product Teams | 4 Product Risks (Value, Usability, Feasibility, Viability); Feature factory prevention | `marty-cagan-product-teams` |
| **Madhavan Ramanujam** | Willingness to Pay & Pricing | 4 Pricing failure modes (Feature Shock, Minivation, Hidden Gem, Undead) | `madhavan-ramanam-pricing` |
| **Claire Vo** | AI-First PM Accelerators | Compressing discovery to minutes with automated PRDs and interactive artifacts | `claire-vo-ai-pm` |

---

## 2. Ingestion & Indexing Pipeline

1. **Schema Validation:** Each episode is stored with guest attribution, episode URL, timestamps, and section breakdowns in `data/transcripts.json`.
2. **Semantic Chunking:** Processed via `backend/app/rag/chunking.py` preserving timestamp tags `[start_timestamp - end_timestamp]` and speaker metadata.
3. **Dense Vector Embeddings:** Generated with `sentence-transformers/all-MiniLM-L6-v2` (384-dimensional vector space).
4. **Database Storage:** Indexed into PostgreSQL (`pgvector`) or local relational store with cosine similarity scoring.
