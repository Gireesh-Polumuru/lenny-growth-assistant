import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_grounded_answer_includes_citations(async_client: AsyncClient):
    payload = {
        "message": "How did Superhuman measure product-market fit?",
        "provider": "mock"
    }
    response = await async_client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "Superhuman" in data["answer"] or "Rahul Vohra" in data["answer"]
    assert len(data["sources"]) > 0
    assert any("Rahul Vohra" in s["guest"] for s in data["sources"])

@pytest.mark.asyncio
async def test_out_of_domain_query_handling(async_client: AsyncClient):
    payload = {
        "message": "What is the capital city of France and its history?",
        "provider": "mock"
    }
    response = await async_client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    # Assistant must acknowledge lack of evidence
    assert "could not find sufficient" in data["answer"].lower() or "not available" in data["answer"].lower()
