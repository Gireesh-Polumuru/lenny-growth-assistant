from typing import List, Dict, Any

def format_sources_for_response(retrieved_chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Formats retrieved database chunks into frontend-ready citation cards."""
    sources = []
    seen = set()
    
    for chunk in retrieved_chunks:
        meta = chunk.get("metadata", {})
        guest = chunk.get("guest") or meta.get("guest", "Lenny's Podcast Guest")
        title = chunk.get("episode_title") or meta.get("title", "Lenny's Podcast Episode")
        start_ts = chunk.get("start_timestamp", "00:00")
        end_ts = chunk.get("end_timestamp", "00:00")
        section = chunk.get("title") or meta.get("section_title", "Key Discussion")
        url = meta.get("episode_url", "https://www.lennyspodcast.com")
        score = chunk.get("score", 0.0)
        
        dedup_key = f"{guest}-{section}-{start_ts}"
        if dedup_key in seen:
            continue
        seen.add(dedup_key)
        
        # Extract a short preview snippet from content
        raw_content = chunk.get("content", "")
        clean_snippet = raw_content.split("\n\n")[-1] if "\n\n" in raw_content else raw_content
        preview = clean_snippet[:220] + "..." if len(clean_snippet) > 220 else clean_snippet
        
        sources.append({
            "title": title,
            "guest": guest,
            "company": meta.get("company", ""),
            "section": section,
            "timestamp": f"{start_ts} - {end_ts}",
            "url": url,
            "snippet": preview,
            "score": round(score, 3)
        })
        
    return sources

def build_grounded_context_prompt(retrieved_chunks: List[Dict[str, Any]]) -> str:
    """Builds the grounding context string injected into the LLM system/user prompt."""
    if not retrieved_chunks:
        return "NO RELEVANT TRANSCRIPT EVIDENCE FOUND."
        
    context_blocks = []
    for idx, chunk in enumerate(retrieved_chunks, start=1):
        content = chunk.get("content", "")
        meta = chunk.get("metadata", {})
        guest = chunk.get("guest") or meta.get("guest", "Guest")
        title = chunk.get("episode_title") or meta.get("title", "Episode")
        start_ts = chunk.get("start_timestamp", "00:00")
        
        block = f"[SOURCE {idx}: {guest} | {title} | Timestamp: {start_ts}]\n{content}"
        context_blocks.append(block)
        
    return "\n\n---\n\n".join(context_blocks)
