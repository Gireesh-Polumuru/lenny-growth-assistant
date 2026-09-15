import os
import hashlib
from typing import List
import numpy as np
from app.core.logger import logger

_model = None

def get_embedding_model():
    global _model
    if os.getenv("APP_ENV") == "test":
        return "fallback"
        
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            logger.info("Loading SentenceTransformer model 'all-MiniLM-L6-v2'...")
            _model = SentenceTransformer("all-MiniLM-L6-v2")
        except Exception as e:
            logger.warning(f"Could not load SentenceTransformer ({e}). Falling back to deterministic fast embedding generator.")
            _model = "fallback"
    return _model

def compute_embedding(text: str, dim: int = 384) -> List[float]:
    """Generates a normalized 384-dimensional dense embedding for text."""
    model = get_embedding_model()
    if model != "fallback" and hasattr(model, "encode"):
        try:
            vec = model.encode(text, convert_to_numpy=True)
            norm = np.linalg.norm(vec)
            if norm > 0:
                vec = vec / norm
            return vec.tolist()
        except Exception as e:
            logger.warning(f"Model encode failed: {e}. Using deterministic fallback.")
    
    # High-signal deterministic TF-hash fallback embedding
    return _deterministic_embedding(text, dim)

def _deterministic_embedding(text: str, dim: int = 384) -> List[float]:
    vec = np.zeros(dim, dtype=np.float32)
    words = text.lower().split()
    if not words:
        return vec.tolist()
        
    for word in words:
        h = int(hashlib.md5(word.encode("utf-8")).hexdigest(), 16)
        idx = h % dim
        sign = 1.0 if (h // dim) % 2 == 0 else -1.0
        vec[idx] += sign
        
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec = vec / norm
    return vec.tolist()

def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    a = np.array(vec_a, dtype=np.float32)
    b = np.array(vec_b, dtype=np.float32)
    dot = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(dot / (norm_a * norm_b))
