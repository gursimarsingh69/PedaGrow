"""Pydantic models for chat API requests and responses."""
from pydantic import BaseModel, Field
from typing import Optional, List


class ChatMessage(BaseModel):
    """Individual chat message model."""
    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    message: str = Field(..., description="User's message", min_length=1)
    conversation_id: Optional[str] = Field(None, description="Optional conversation ID for context")
    history: Optional[List[ChatMessage]] = Field(None, description="Optional conversation history")


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    response: str = Field(..., description="AI assistant's response")
    conversation_id: Optional[str] = Field(None, description="Conversation ID for tracking")
    sources: Optional[List[str]] = Field(None, description="Source documents used for context")


class HealthResponse(BaseModel):
    """Health check response model."""
    status: str = Field(..., description="Service status")
    version: str = Field(default="1.0.0", description="API version")
