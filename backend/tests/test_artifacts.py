import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_artifact_generation_and_storage(async_client: AsyncClient):
    session_res = await async_client.post("/api/sessions", json={"title": "Artifact Test"})
    session_id = session_res.json()["id"]
    
    # Send message triggering HTML artifact creation
    chat_res = await async_client.post(
        f"/api/sessions/{session_id}/messages",
        json={"message": "Create an interactive HTML calculator for calculating PMF score", "provider": "mock"}
    )
    assert chat_res.status_code == 200
    data = chat_res.json()
    assert data["artifact"] is not None
    assert data["artifact"]["type"] in ["html", "markdown"]
    artifact_id = data["artifact"]["id"]
    assert artifact_id is not None
    
    # Retrieve single artifact via API
    get_art_res = await async_client.get(f"/api/artifacts/{artifact_id}")
    assert get_art_res.status_code == 200
    art_data = get_art_res.json()
    assert art_data["id"] == artifact_id
    assert "PMF" in art_data["title"] or "Calculator" in art_data["title"]
    
    # Retrieve all artifacts for the session
    list_arts_res = await async_client.get(f"/api/artifacts/session/{session_id}")
    assert list_arts_res.status_code == 200
    artifacts = list_arts_res.json()
    assert len(artifacts) >= 1
