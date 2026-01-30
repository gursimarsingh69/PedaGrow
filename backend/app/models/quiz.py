"""Pydantic models for quiz API requests and responses."""
from pydantic import BaseModel, Field
from typing import Optional, List


class QuizRequest(BaseModel):
    """Request model for quiz generation."""
    subject: str = Field(..., description="Subject for the quiz", min_length=1)
    class_level: str = Field(..., description="Class/Grade level", min_length=1)
    curriculum: str = Field(..., description="Curriculum type", min_length=1)


class QuizQuestion(BaseModel):
    """Individual quiz question model."""
    question: str = Field(..., description="The question text")
    options: List[str] = Field(..., description="Multiple choice options")
    correct_answer: int = Field(..., description="Index of correct answer (0-based)")


class QuizResponse(BaseModel):
    """Response model for quiz generation."""
    quiz_id: str = Field(..., description="Unique ID for the quiz")
    questions: List[QuizQuestion] = Field(..., description="List of quiz questions")


class QuizSubmission(BaseModel):
    """Request model for quiz submission."""
    quiz_id: str = Field(..., description="Quiz ID")
    answers: List[int] = Field(..., description="User's answers (indices)")


class QuizResult(BaseModel):
    """Response model for quiz results."""
    score: int = Field(..., description="Number of correct answers")
    total: int = Field(..., description="Total number of questions")
    percentage: float = Field(..., description="Score percentage")
    feedback: str = Field(..., description="AI feedback on performance")