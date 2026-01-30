from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from app.models.chat import ChatRequest, ChatResponse, HealthResponse
from app.models.quiz import QuizRequest, QuizResponse, QuizSubmission, QuizResult
from app.services.rag_service import get_rag_service
from app.services.mcp_service import get_mcp_service
from app.services.llm_service import get_llm_service
import uuid

# Simple in-memory quiz storage (in production, use database)
quiz_storage = {}

def generate_fallback_questions(subject: str, class_level: str):
    """Generate fallback questions when AI fails"""
    # Simple fallback questions based on subject
    if subject.lower() == "mathematics":
        return [
            {
                "question": "What is 2 + 2?",
                "options": ["3", "4", "5", "6"],
                "correct_answer": 1
            },
            {
                "question": "What is the square root of 16?",
                "options": ["2", "4", "8", "16"],
                "correct_answer": 1
            },
            {
                "question": "What is 10 × 5?",
                "options": ["15", "50", "55", "105"],
                "correct_answer": 1
            },
            {
                "question": "What is 100 ÷ 4?",
                "options": ["20", "25", "30", "35"],
                "correct_answer": 1
            },
            {
                "question": "What is the area of a square with side 3?",
                "options": ["6", "9", "12", "15"],
                "correct_answer": 1
            }
        ]
    elif subject.lower() == "physics":
        return [
            {
                "question": "What is the SI unit of force?",
                "options": ["Watt", "Newton", "Joule", "Pascal"],
                "correct_answer": 1
            },
            {
                "question": "What is the speed of light?",
                "options": ["3×10^6 m/s", "3×10^8 m/s", "3×10^10 m/s", "3×10^12 m/s"],
                "correct_answer": 1
            }
        ]
    else:
        return [
            {
                "question": f"What is a basic concept in {subject}?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": 0
            }
        ]

router = APIRouter(prefix="/api")


@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(status="healthy", version="1.0.0")


@router.options("/chat")
async def chat_options():
    """Handle CORS preflight requests - must be before POST route."""
    return Response(status_code=200)


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        print(f"Processing chat request: {request.message[:50]}...")
        
        rag_service = get_rag_service()
        print("RAG service initialized")
        
        mcp_service = get_mcp_service()
        print("MCP service initialized")
        
        llm_service = get_llm_service()
        print("LLM service initialized")

        retrieved_docs = rag_service.retrieve_context(request.message)
        context_text = rag_service.get_context_text(request.message)
        print(f"Retrieved {len(retrieved_docs)} context documents")

        history = None
        if request.history:
            history = [
                {"role": msg.role, "content": msg.content}
                for msg in request.history
            ]

        print("Generating LLM response...")
        response_text = llm_service.generate_response(
            query=request.message,
            context=context_text,
            conversation_history=history,
        )
        print(f"LLM response generated: {len(response_text)} characters")

        sources = rag_service.get_sources(request.message)
        conversation_id = request.conversation_id or str(uuid.uuid4())

        return ChatResponse(
            response=response_text,
            conversation_id=conversation_id,
            sources=sources,
        )

    except ValueError as e:
        print(f"ValueError in chat endpoint: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error in chat endpoint: {e}")
        print(f"Traceback: {error_trace}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/quiz/generate", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    try:
        print(f"Generating quiz for subject: {request.subject}, class: {request.class_level}, curriculum: {request.curriculum}")
        
        llm_service = get_llm_service()
        
        # Create prompt for quiz generation
        prompt = f"""
        Generate a quiz with 5-10 multiple choice questions for {request.subject} at {request.class_level} level following {request.curriculum} curriculum.
        
        Requirements:
        - Each question should have exactly 4 options (A, B, C, D)
        - Only one correct answer per question
        - Questions should be appropriate for the class level
        - Cover key concepts in the subject
        
        Return ONLY valid JSON with this exact structure, no additional text:
        {{
            "questions": [
                {{
                    "question": "Question text here?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct_answer": 0
                }},
                {{
                    "question": "Another question?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct_answer": 1
                }}
            ]
        }}
        """
        
        response_text = llm_service.generate_response(
            query=prompt,
            context="",  # No RAG context for quiz generation
            conversation_history=None,
        )
        
        print(f"LLM response: {response_text[:500]}...")
        
        # Parse the JSON response - try to extract JSON from response
        import json
        import re
        
        # Try to find JSON in the response
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group()
            try:
                quiz_data = json.loads(json_str)
                questions = quiz_data.get("questions", [])
                
                # Validate questions
                if not questions or len(questions) < 5:
                    # Fallback: generate simple questions
                    questions = generate_fallback_questions(request.subject, request.class_level)
                
                quiz_id = str(uuid.uuid4())
                
                # Store quiz data
                quiz_storage[quiz_id] = {
                    "questions": questions,
                    "subject": request.subject,
                    "class_level": request.class_level,
                    "curriculum": request.curriculum
                }
                
                return QuizResponse(
                    quiz_id=quiz_id,
                    questions=questions
                )
                
            except json.JSONDecodeError as e:
                print(f"Failed to parse quiz JSON: {json_str}")
                # Fallback
                questions = generate_fallback_questions(request.subject, request.class_level)
                quiz_id = str(uuid.uuid4())
                # Store quiz data
                quiz_storage[quiz_id] = {
                    "questions": questions,
                    "subject": request.subject,
                    "class_level": request.class_level,
                    "curriculum": request.curriculum
                }
                return QuizResponse(
                    quiz_id=quiz_id,
                    questions=questions
                )
        else:
            # Fallback
            questions = generate_fallback_questions(request.subject, request.class_level)
            quiz_id = str(uuid.uuid4())
            # Store quiz data
            quiz_storage[quiz_id] = {
                "questions": questions,
                "subject": request.subject,
                "class_level": request.class_level,
                "curriculum": request.curriculum
            }
            return QuizResponse(
                quiz_id=quiz_id,
                questions=questions
            )
            
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error in quiz generation: {e}")
        print(f"Traceback: {error_trace}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/quiz/submit", response_model=QuizResult)
async def submit_quiz(request: QuizSubmission):
    try:
        print(f"Submitting quiz {request.quiz_id} with {len(request.answers)} answers")
        
        # Retrieve quiz data
        quiz_data = quiz_storage.get(request.quiz_id)
        if not quiz_data:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        questions = quiz_data["questions"]
        correct_answers = [q["correct_answer"] for q in questions]
        
        score = sum(1 for user_ans, correct in zip(request.answers, correct_answers) if user_ans == correct)
        total = len(correct_answers)
        percentage = (score / total) * 100 if total > 0 else 0
        
        feedback = f"You got {score} out of {total} questions correct ({percentage:.1f}%). "
        if percentage >= 80:
            feedback += "Excellent work! Keep it up."
        elif percentage >= 60:
            feedback += "Good job! Review the topics you missed."
        else:
            feedback += "Keep studying and try again. You can do it!"
        
        return QuizResult(
            score=score,
            total=total,
            percentage=percentage,
            feedback=feedback
        )
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error in quiz submission: {e}")
        print(f"Traceback: {error_trace}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")