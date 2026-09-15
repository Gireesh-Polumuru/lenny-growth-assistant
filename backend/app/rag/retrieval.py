import json
from typing import List, Dict, Any, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import TranscriptChunkModel, TranscriptModel
from app.rag.embeddings import compute_embedding, cosine_similarity
from app.core.logger import logger

async def retrieve_relevant_chunks(
    query: str,
    db: AsyncSession,
    top_k: int = 5,
    min_similarity: float = 0.25
) -> List[Dict[str, Any]]:
    """
    Retrieves the most relevant transcript chunks for a user query.
    Calculates cosine similarity between query embedding and stored chunk embeddings.
    """
    query_embedding = compute_embedding(query)
    
    # Query all transcript chunks with their parent transcripts
    stmt = select(TranscriptChunkModel, TranscriptModel).join(
        TranscriptModel, TranscriptChunkModel.transcript_id == TranscriptModel.id
    )
    result = await db.execute(stmt)
    rows = result.all()
    
    if not rows:
        logger.warning("No transcript chunks found in database.")
        return []
        
    scored_chunks = []
    
    # Keyword bonus set for domain terminology
    query_terms = set(query.lower().split())
    
    for chunk, transcript in rows:
        chunk_emb = chunk.embedding_json
        if not chunk_emb:
            # Fallback: compute on the fly if not cached
            chunk_emb = compute_embedding(chunk.content)
            
        sim = cosine_similarity(query_embedding, chunk_emb)
        
        # Add light lexical match bonus for exact keywords (e.g. "superhuman", "elena", "lno", "balfour")
        content_lower = chunk.content.lower()
        keyword_hits = sum(1 for term in query_terms if len(term) > 3 and term in content_lower)
        lexical_bonus = min(keyword_hits * 0.08, 0.24)
        
        final_score = sim + lexical_bonus
        
        if final_score >= min_similarity:
            meta = dict(chunk.chunk_metadata or {})
            meta.update({
                "guest": transcript.guest,
                "company": transcript.company,
                "episode_url": transcript.episode_url,
                "source_url": transcript.source_url,
                "title": transcript.title,
                "section_title": chunk.title
            })
            
            scored_chunks.append({
                "id": chunk.id,
                "transcript_id": chunk.transcript_id,
                "chunk_index": chunk.chunk_index,
                "title": chunk.title,
                "content": chunk.content,
                "start_timestamp": chunk.start_timestamp,
                "end_timestamp": chunk.end_timestamp,
                "guest": transcript.guest,
                "episode_title": transcript.title,
                "score": final_score,
                "metadata": meta
            })
            
    # Sort descending by score
    scored_chunks.sort(key=lambda x: x["score"], reverse=True)
    top_results = scored_chunks[:top_k]
    
    logger.info(f"Retrieved {len(top_results)} chunks for query: '{query[:40]}...' (Top score: {top_results[0]['score'] if top_results else 0.0:.3f})")
    return top_results
