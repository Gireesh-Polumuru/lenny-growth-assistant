import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_session_lifecycle(async_client: AsyncClient):
    # 1. Create a session
    create_res = await async_client.post("/api/sessions", json={"title": "Superhuman PMF Chat"})
    assert create_res.status_code == 201
    session_data = create_res.json()
    assert session_data["title"] == "Superhuman PMF Chat"
    session_id = session_data["id"]
    
    # 2. List sessions
    list_res = await async_client.get("/api/sessions")
    assert list_res.status_code == 200
    sessions = list_res.json()
    assert any(s["id"] == session_id for s in sessions)
    
    # 3. Get single session
    get_res = await async_client.get(f"/api/sessions/{session_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == session_id
    
    # 4. Delete session
    del_res = await async_client.delete(f"/api/sessions/{session_id}")
    assert del_res.status_code == 204
    
    # 5. Verify deleted
    verify_res = await async_client.get(f"/api/sessions/{session_id}")
    assert verify_res.status_code == 404
