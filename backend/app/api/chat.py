import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.db.models import SessionModel, MessageModel, ArtifactModel
from app.schemas.chat import ChatRequest, ChatResponse, ArtifactResponse
from app.rag.retrieval import retrieve_relevant_chunks
from app.agents.router import classify_intent
from app.agents.grounded_qa import GroundedQAAgent
from app.agents.ship30 import Ship30Agent
from app.agents.artifact_agent import ArtifactAgent
from app.llm.factory import get_llm_provider
from app.llm.mock_engine import MockLLMProvider
from app.core.config import settings
from app.core.logger import logger

router = APIRouter(prefix="/api", tags=["Chat"])

@router.post("/sessions/{session_id}/messages", response_model=ChatResponse)
@router.post("/chat", response_model=ChatResponse)
async def handle_chat_message(
    chat_req: ChatRequest,
    session_id: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    request_id = str(uuid.uuid4())[:8]
    
    # 1. Resolve or create Session
    session = None
    if session_id:
        stmt = select(SessionModel).where(SessionModel.id == session_id)
        result = await db.execute(stmt)
        session = result.scalar_one_or_none()
        
    if not session:
        session = SessionModel(
            title=chat_req.message[:50] + ("..." if len(chat_req.message) > 50 else ""),
            session_metadata={"created_by": "chat_endpoint"}
        )
        db.add(session)
        await db.commit()
        await db.refresh(session)
        
    resolved_session_id = session.id
    
    # 2. Persist User Message
    user_msg = MessageModel(
        session_id=resolved_session_id,
        role="user",
        content=chat_req.message,
        provider=chat_req.provider,
        model=chat_req.model
    )
    db.add(user_msg)
    await db.commit()
    
    # 3. Retrieve Session History for Context Preservation
    history_stmt = select(MessageModel).where(
        MessageModel.session_id == resolved_session_id
    ).order_by(MessageModel.created_at.asc())
    history_res = await db.execute(history_stmt)
    history_records = history_res.scalars().all()
    
    conversation_history = [
        {"role": record.role, "content": record.content}
        for record in history_records[:-1]
    ]
    
    # 4. Semantic Knowledge Retrieval
    retrieved_chunks = await retrieve_relevant_chunks(
        query=chat_req.message,
        db=db,
        top_k=5
    )
    
    # 5. Agent Routing & Intent Classification
    intent = classify_intent(chat_req.message)
    provider_inst = get_llm_provider(chat_req.provider)
    
    logger.info(
        f"Processing chat [req_id={request_id} session={resolved_session_id} intent={intent} provider={chat_req.provider or 'default'}]"
    )
    
    # 6. Execute Specialized Agent (Honoring Selected Provider)
    try:
        if intent == "ESSAY":
            agent = Ship30Agent(provider=provider_inst)
            agent_result = await agent.run(
                query=chat_req.message,
                retrieved_chunks=retrieved_chunks,
                conversation_history=conversation_history,
                model_name=chat_req.model
            )
        elif intent == "ARTIFACT":
            agent = ArtifactAgent(provider=provider_inst)
            agent_result = await agent.run(
                query=chat_req.message,
                retrieved_chunks=retrieved_chunks,
                conversation_history=conversation_history,
                model_name=chat_req.model
            )
        else:  # "QUESTION"
            agent = GroundedQAAgent(provider=provider_inst)
            agent_result = await agent.run(
                query=chat_req.message,
                retrieved_chunks=retrieved_chunks,
                conversation_history=conversation_history,
                model_name=chat_req.model
            )
    except Exception as e:
        logger.error(f"Target LLM provider '{chat_req.provider}' execution failed: {str(e)}", exc_info=True)
        if (chat_req.provider or "").lower() == "ollama":
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Ollama provider unavailable: {str(e)}. Please ensure Ollama is running or switch to Claude or Deterministic Mock in the top toolbar."
            )
        elif (chat_req.provider or "").lower() in ["anthropic", "claude"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Anthropic Claude provider error: {str(e)}. Please ensure ANTHROPIC_API_KEY is configured or switch to Ollama or Deterministic Mock."
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Provider '{chat_req.provider}' error: {str(e)}"
            )
        
    # 7. Persist Generated Artifact (if any)
    artifact_id = None
    artifact_resp_obj = None
    if agent_result.get("artifact"):
        art_data = agent_result["artifact"]
        artifact_record = ArtifactModel(
            session_id=resolved_session_id,
            type=art_data.get("type", "html"),
            title=art_data.get("title", "Growth Artifact"),
            content=art_data.get("content", ""),
            language=art_data.get("language", "html"),
            artifact_metadata=art_data.get("metadata", {})
        )
        db.add(artifact_record)
        await db.commit()
        await db.refresh(artifact_record)
        artifact_id = artifact_record.id
        artifact_resp_obj = ArtifactResponse(
            id=artifact_record.id,
            type=artifact_record.type,
            title=artifact_record.title,
            content=artifact_record.content,
            language=artifact_record.language,
            metadata=artifact_record.artifact_metadata
        )
        
    # 8. Persist Assistant Message
    assistant_msg = MessageModel(
        session_id=resolved_session_id,
        role="assistant",
        content=agent_result.get("answer", ""),
        provider=agent_result.get("provider"),
        model=agent_result.get("model"),
        sources=agent_result.get("sources", []),
        artifact_id=artifact_id,
        message_metadata={"latency_ms": agent_result.get("latency_ms")}
    )
    db.add(assistant_msg)
    
    # Update session title if first exchange
    if len(history_records) <= 1:
        session.title = chat_req.message[:50] + ("..." if len(chat_req.message) > 50 else "")
        
    await db.commit()
    await db.refresh(assistant_msg)
    
    return ChatResponse(
        session_id=resolved_session_id,
        message_id=assistant_msg.id,
        role="assistant",
        answer=agent_result.get("answer", ""),
        sources=agent_result.get("sources", []),
        artifact=artifact_resp_obj,
        provider=agent_result.get("provider", "mock"),
        model=agent_result.get("model", settings.OLLAMA_MODEL),
        latency_ms=agent_result.get("latency_ms")
    )
