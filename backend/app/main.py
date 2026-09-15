import time
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logger import logger
from app.db.database import init_db
from app.rag.ingestion import ingest_transcripts_from_file
from app.api.health import router as health_router
from app.api.sessions import router as sessions_router
from app.api.chat import router as chat_router
from app.api.artifacts import router as artifacts_router
from app.api.models import router as models_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing The Lenny Growth Assistant service...")
    await init_db()
    # Auto-seed transcript knowledge base if empty
    try:
        await ingest_transcripts_from_file()
    except Exception as e:
        logger.warning(f"Transcript auto-ingestion error: {e}")
    logger.info("Backend service startup completed and ready for requests.")
    yield
    logger.info("Shutting down The Lenny Growth Assistant service...")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Conversational Growth & Product Management Assistant grounded strictly in Lenny's Podcast transcripts.",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits frontend in local dev, Docker, or staging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Timing & Structured Logging Middleware
@app.middleware("http")
async def log_requests_middleware(request: Request, call_next):
    request_id = str(uuid.uuid4())[:8]
    start_time = time.time()
    
    response = await call_next(request)
    
    process_time_ms = round((time.time() - start_time) * 1000, 2)
    response.headers["X-Process-Time-Ms"] = str(process_time_ms)
    response.headers["X-Request-Id"] = request_id
    
    if request.url.path not in ["/health", "/health/live"]:
        logger.info(
            f"{request.method} {request.url.path} - Status: {response.status_code} - Latency: {process_time_ms}ms [req_id={request_id}]"
        )
    return response

# Custom Structured Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled server exception on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "InternalServerError",
            "message": "An unexpected error occurred while processing your request.",
            "detail": str(exc) if settings.APP_ENV == "development" else None
        }
    )

import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Include API Routers
app.include_router(health_router)
app.include_router(sessions_router)
app.include_router(chat_router)
app.include_router(artifacts_router)
app.include_router(models_router)

# Mount Frontend static files if built
dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(dist_dir) and os.path.exists(os.path.join(dist_dir, "index.html")):
    app.mount("/assets", StaticFiles(directory=os.path.join(dist_dir, "assets")), name="assets")
    
    @app.get("/{full_path:path}", tags=["Frontend"])
    async def serve_frontend(full_path: str):
        file_path = os.path.join(dist_dir, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))
else:
    @app.get("/", tags=["System"])
    async def root():
        return {
            "app": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "status": "online",
            "docs_url": "/docs",
            "health_url": "/health",
            "api_endpoints": {
                "chat": "/api/chat",
                "sessions": "/api/sessions",
                "artifacts": "/api/artifacts",
                "models": "/api/models"
            }
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
