/**
 * API utility for communicating with the PedaGrow AI backend
 */

// Use relative URL so Vite proxy handles the routing
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  response: string;
  conversation_id?: string;
  sources?: string[];
}

export interface QuizRequest {
  subject: string;
  class_level: string;
  curriculum: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: number;
}

export interface QuizResponse {
  quiz_id: string;
  questions: QuizQuestion[];
}

export interface QuizSubmission {
  quiz_id: string;
  answers: number[];
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  feedback: string;
}

/**
 * Check if the backend API is healthy
 */
export async function checkHealth(): Promise<HealthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
}

/**
 * Send a chat message to the backend and get AI response
 */
export async function sendChatMessage(
  message: string,
  conversationId?: string,
  history?: ChatMessage[]
): Promise<ChatResponse> {
  try {
    const requestBody: ChatRequest = {
      message,
      ...(conversationId && { conversation_id: conversationId }),
      ...(history && { history }),
    };

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || `Request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Provide more helpful error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(
        `Failed to connect to backend server. ` +
        `Please make sure the backend is running on port 8000. ` +
        `You can start it by running: cd backend && python start.py`
      );
    }
    
    throw error;
  }
}

/**
 * Generate a quiz based on subject, class, and curriculum
 */
export async function generateQuiz(request: QuizRequest): Promise<QuizResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/quiz/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || `Request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Quiz generation API error:', error);
    throw error;
  }
}

/**
 * Submit quiz answers and get results
 */
export async function submitQuiz(submission: QuizSubmission): Promise<QuizResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/quiz/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || `Request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Quiz submission API error:', error);
    throw error;
  }
}
