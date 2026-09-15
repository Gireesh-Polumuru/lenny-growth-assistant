import asyncio
import json
import os
from pathlib import Path
from sqlalchemy import select, delete
from app.db.database import AsyncSessionLocal, init_db
from app.db.models import TranscriptModel, TranscriptChunkModel
from app.rag.chunking import chunk_transcript
from app.rag.embeddings import compute_embedding
from app.core.logger import logger

DATA_FILE = Path(__file__).resolve().parent.parent.parent.parent / "data" / "transcripts.json"

async def ingest_transcripts_from_file(file_path: Path = DATA_FILE, force_reindex: bool = False):
    """Loads transcripts from JSON, creates semantic chunks with embeddings, and saves to database."""
    if not file_path.exists():
        logger.error(f"Transcripts data file not found at: {file_path}")
        return 0
        
    with open(file_path, "r", encoding="utf-8") as f:
        transcripts_data = json.load(f)
        
    await init_db()
    
    async with AsyncSessionLocal() as db:
        # Check existing count
        existing_result = await db.execute(select(TranscriptModel))
        existing_count = len(existing_result.scalars().all())
        
        if existing_count > 0 and not force_reindex:
            logger.info(f"Database already contains {existing_count} transcripts. Skipping re-ingestion.")
            return existing_count
            
        if force_reindex:
            logger.info("Force reindexing: clearing existing transcripts and chunks...")
            await db.execute(delete(TranscriptChunkModel))
            await db.execute(delete(TranscriptModel))
            await db.commit()
            
        total_chunks = 0
        for item in transcripts_data:
            transcript = TranscriptModel(
                id=item["id"],
                title=item["title"],
                guest=item["guest"],
                company=item.get("company", ""),
                episode_url=item.get("episode_url", ""),
                source_url=item.get("source_url", ""),
                summary=item.get("summary", ""),
                published_at=item.get("published_at", ""),
                transcript_metadata=item.get("metadata", {})
            )
            db.add(transcript)
            
            # Chunk the transcript
            chunks = chunk_transcript(item)
            for chunk_data in chunks:
                emb = compute_embedding(chunk_data["content"])
                chunk_record = TranscriptChunkModel(
                    id=chunk_data["id"],
                    transcript_id=chunk_data["transcript_id"],
                    chunk_index=chunk_data["chunk_index"],
                    title=chunk_data["title"],
                    content=chunk_data["content"],
                    start_timestamp=chunk_data["start_timestamp"],
                    end_timestamp=chunk_data["end_timestamp"],
                    embedding_json=emb,
                    chunk_metadata=chunk_data["metadata"]
                )
                db.add(chunk_record)
                total_chunks += 1
                
        await db.commit()
        logger.info(f"Successfully ingested {len(transcripts_data)} transcripts ({total_chunks} semantic chunks indexed).")
        return len(transcripts_data)

def run_cli_ingestion():
    asyncio.run(ingest_transcripts_from_file(force_reindex=True))

if __name__ == "__main__":
    run_cli_ingestion()
