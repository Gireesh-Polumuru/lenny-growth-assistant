import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import Column, String, Text, Integer, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def get_utc_now():
    return datetime.now(timezone.utc)

class SessionModel(Base):
    __tablename__ = "sessions"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False, default="New Conversation")
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    updated_at = Column(DateTime(timezone=True), default=get_utc_now, onupdate=get_utc_now)
    session_metadata = Column(JSON, default=dict)
    
    messages = relationship("MessageModel", back_populates="session", cascade="all, delete-orphan", order_by="MessageModel.created_at", lazy="selectin")
    artifacts = relationship("ArtifactModel", back_populates="session", cascade="all, delete-orphan", order_by="ArtifactModel.created_at", lazy="selectin")

class MessageModel(Base):
    __tablename__ = "messages"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(20), nullable=False)  # 'user', 'assistant', 'system'
    content = Column(Text, nullable=False)
    model = Column(String(100), nullable=True)
    provider = Column(String(50), nullable=True)
    sources = Column(JSON, default=list)
    artifact_id = Column(String(36), nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    message_metadata = Column(JSON, default=dict)
    
    session = relationship("SessionModel", back_populates="messages")

class TranscriptModel(Base):
    __tablename__ = "transcripts"
    
    id = Column(String(50), primary_key=True)
    title = Column(String(255), nullable=False)
    guest = Column(String(150), nullable=False)
    company = Column(String(150), nullable=True)
    episode_url = Column(String(500), nullable=True)
    source_url = Column(String(500), nullable=True)
    summary = Column(Text, nullable=True)
    published_at = Column(String(50), nullable=True)
    transcript_metadata = Column(JSON, default=dict)
    
    chunks = relationship("TranscriptChunkModel", back_populates="transcript", cascade="all, delete-orphan")

class TranscriptChunkModel(Base):
    __tablename__ = "transcript_chunks"
    
    id = Column(String(60), primary_key=True, default=generate_uuid)
    transcript_id = Column(String(50), ForeignKey("transcripts.id", ondelete="CASCADE"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    title = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)
    start_timestamp = Column(String(20), nullable=True)
    end_timestamp = Column(String(20), nullable=True)
    embedding_json = Column(JSON, nullable=True)
    chunk_metadata = Column(JSON, default=dict)
    
    transcript = relationship("TranscriptModel", back_populates="chunks")

class ArtifactModel(Base):
    __tablename__ = "artifacts"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)  # 'markdown', 'html', 'code'
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    language = Column(String(50), nullable=True, default="html")
    created_at = Column(DateTime(timezone=True), default=get_utc_now)
    artifact_metadata = Column(JSON, default=dict)
    
    session = relationship("SessionModel", back_populates="artifacts")
