import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base
from app.core.config import settings
from app.core.logger import logger

# Ensure database directory exists if sqlite
db_url = settings.DATABASE_URL
if db_url.startswith("sqlite"):
    os.makedirs("./data", exist_ok=True)

# Build async engine
engine = create_async_engine(
    db_url,
    echo=False,
    future=True,
    pool_pre_ping=True if not db_url.startswith("sqlite") else False,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            logger.error(f"Database session error: {str(e)}")
            raise
        finally:
            await session.close()

async def init_db():
    async with engine.begin() as conn:
        # If postgres, try creating vector extension
        if "postgresql" in settings.DATABASE_URL:
            try:
                from sqlalchemy import text
                await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
            except Exception as e:
                logger.warning(f"Could not enable vector extension: {e}")
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database initialized successfully.")
