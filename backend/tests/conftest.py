import os
import sys
from pathlib import Path
import pytest_asyncio
from httpx import AsyncClient, ASGITransport

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

# Force SQLite in-memory / local test database for tests
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"
os.environ["APP_ENV"] = "test"
os.environ["DEFAULT_LLM_PROVIDER"] = "mock"

from app.main import app
from app.db.database import init_db, engine, Base
from app.rag.ingestion import ingest_transcripts_from_file

@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_test_database():
    await init_db()
    await ingest_transcripts_from_file(force_reindex=True)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest_asyncio.fixture
async def async_client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client
