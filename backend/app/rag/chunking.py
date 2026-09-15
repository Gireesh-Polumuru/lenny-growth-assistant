from typing import List, Dict, Any

def chunk_transcript(transcript_data: Dict[str, Any], max_chunk_words: int = 250, overlap_words: int = 40) -> List[Dict[str, Any]]:
    """
    Chunks a transcript into semantic segments while preserving timestamps, 
    guest attribution, section headers, and overlap for context continuity.
    """
    chunks = []
    sections = transcript_data.get("sections", [])
    transcript_id = transcript_data.get("id")
    guest = transcript_data.get("guest", "Unknown")
    title = transcript_data.get("title", "Lenny's Podcast")
    
    chunk_index = 0
    
    for section in sections:
        sec_title = section.get("title", "")
        content = section.get("content", "")
        start_ts = section.get("start_timestamp", "00:00")
        end_ts = section.get("end_timestamp", "00:00")
        
        words = content.split()
        if not words:
            continue
            
        if len(words) <= max_chunk_words:
            # Whole section fits in a chunk
            chunk_text = f"Speaker: {guest}\nEpisode: {title}\nSection: {sec_title}\nTimestamp: [{start_ts} - {end_ts}]\n\n{content}"
            chunks.append({
                "id": f"{transcript_id}-chunk-{chunk_index}",
                "transcript_id": transcript_id,
                "chunk_index": chunk_index,
                "title": sec_title,
                "content": chunk_text,
                "start_timestamp": start_ts,
                "end_timestamp": end_ts,
                "guest": guest,
                "episode_title": title,
                "metadata": {
                    "guest": guest,
                    "company": transcript_data.get("company", ""),
                    "episode_url": transcript_data.get("episode_url", ""),
                    "source_url": transcript_data.get("source_url", ""),
                    "section_title": sec_title
                }
            })
            chunk_index += 1
        else:
            # Split with sliding window
            stride = max_chunk_words - overlap_words
            for i in range(0, len(words), stride):
                window_words = words[i:i + max_chunk_words]
                window_content = " ".join(window_words)
                chunk_text = f"Speaker: {guest}\nEpisode: {title}\nSection: {sec_title}\nTimestamp: [{start_ts} - {end_ts}]\n\n{window_content}"
                chunks.append({
                    "id": f"{transcript_id}-chunk-{chunk_index}",
                    "transcript_id": transcript_id,
                    "chunk_index": chunk_index,
                    "title": sec_title,
                    "content": chunk_text,
                    "start_timestamp": start_ts,
                    "end_timestamp": end_ts,
                    "guest": guest,
                    "episode_title": title,
                    "metadata": {
                        "guest": guest,
                        "company": transcript_data.get("company", ""),
                        "episode_url": transcript_data.get("episode_url", ""),
                        "source_url": transcript_data.get("source_url", ""),
                        "section_title": sec_title
                    }
                })
                chunk_index += 1
                if i + max_chunk_words >= len(words):
                    break
                    
    return chunks
