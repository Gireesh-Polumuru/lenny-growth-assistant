import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_session_multi_turn_persistence(async_client: AsyncClient):
    # 1. Create session
    session_res = await async_client.post("/api/sessions", json={"title": "Multi-turn Persistence Test"})
    assert session_res.status_code == 201
    session_id = session_res.json()["id"]
    
    # 2. First turn
    msg1_res = await async_client.post(
        f"/api/sessions/{session_id}/messages",
        json={"message": "What is the Sean Ellis benchmark for Superhuman?", "provider": "mock"}
    )
    assert msg1_res.status_code == 200
    data1 = msg1_res.json()
    assert data1["session_id"] == session_id
    assert "Superhuman" in data1["answer"] or "40%" in data1["answer"]
    
    # 3. Second turn (follow-up preserving context)
    msg2_res = await async_client.post(
        f"/api/sessions/{session_id}/messages",
        json={"message": "How did they segment their high-expectation customers?", "provider": "mock"}
    )
    assert msg2_res.status_code == 200
    data2 = msg2_res.json()
    assert data2["session_id"] == session_id
    
    # 4. Fetch all messages in session
    messages_res = await async_client.get(f"/api/sessions/{session_id}/messages")
    assert messages_res.status_code == 200
    messages = messages_res.json()
    # Expect 4 messages (2 user + 2 assistant)
    assert len(messages) == 4
