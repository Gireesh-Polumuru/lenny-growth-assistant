import pytest
from httpx import AsyncClient
from app.llm.ollama import OllamaProvider
from app.core.config import settings

@pytest.mark.asyncio
async def test_ollama_provider_configuration_and_timeout():
    """Verify OllamaProvider uses configured model (llama3.2:latest) and extended 180s timeout."""
    provider = OllamaProvider()
    assert provider.default_model == "llama3.2:latest"
    assert provider.timeout >= 180.0
    assert "11434" in provider.base_url

@pytest.mark.asyncio
async def test_ollama_status_in_models_endpoint(async_client: AsyncClient):
    """Verify /api/models exposes Ollama provider status and configuration accurately."""
    response = await async_client.get("/api/models")
    assert response.status_code == 200
    data = response.json()
    assert "providers" in data
    assert "ollama" in data["providers"]
    ollama_info = data["providers"]["ollama"]
    assert "base_url" in ollama_info
    assert ollama_info["default_model"] == "llama3.2:latest"
