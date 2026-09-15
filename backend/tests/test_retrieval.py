import pytest
from app.db.database import AsyncSessionLocal
from app.rag.retrieval import retrieve_relevant_chunks

@pytest.mark.asyncio
async def test_retrieval_for_superhuman_pmf():
    async with AsyncSessionLocal() as db:
        results = await retrieve_relevant_chunks("How did Superhuman measure product market fit with Rahul Vohra?", db, top_k=3)
        assert len(results) > 0
        top_chunk = results[0]
        assert "Rahul Vohra" in top_chunk["guest"] or "Superhuman" in top_chunk["content"]
        assert top_chunk["score"] > 0.3

@pytest.mark.asyncio
async def test_retrieval_for_elena_verna_plg():
    async with AsyncSessionLocal() as db:
        results = await retrieve_relevant_chunks("What are B2B product qualified leads according to Elena Verna?", db, top_k=3)
        assert len(results) > 0
        top_chunk = results[0]
        assert "Elena Verna" in top_chunk["guest"] or "Miro" in top_chunk["content"]

@pytest.mark.asyncio
async def test_empty_retrieval_for_irrelevant_query():
    async with AsyncSessionLocal() as db:
        results = await retrieve_relevant_chunks("quantum physics black hole astrophysics equations", db, top_k=3, min_similarity=0.45)
        # Should return no results or very low confidence
        assert len(results) == 0 or results[0]["score"] < 0.45
