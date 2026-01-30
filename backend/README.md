# PedaGrow AI Backend

Python backend with RAG (Retrieval-Augmented Generation) and MCP (Model Context Protocol) integration for the PedaGrow AI educational assistant.

## Features

- **RAG System**: Document retrieval using vector embeddings and similarity search
- **MCP Integration**: Model Context Protocol for structured context management
- **LLM Support**: OpenAI and Anthropic API integration
- **FastAPI**: Modern, fast web framework for building APIs
- **Vector Store**: ChromaDB for efficient document retrieval

## Quick Start

### Windows:
```bash
cd backend
start.bat
```

### Linux/Mac:
```bash
cd backend
chmod +x start.sh
./start.sh
```

### Manual Setup

#### 1. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`.

#### 4. Initialize Knowledge Base

Place your educational documents (`.txt` files) in the `data/` directory. The system will automatically index them on first run.

#### 5. Run the Server

**Option 1: Using the startup script (Recommended)**
```bash
python start.py
```

**Option 2: Using uvicorn directly**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Option 3: Using Python module**
```bash
python -m app.main
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Chat
```
POST /api/chat
Content-Type: application/json

{
  "message": "What is photosynthesis?",
  "conversation_id": "optional-uuid",
  "history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi! How can I help?"}
  ]
}
```

Response:
```json
{
  "response": "AI-generated response...",
  "conversation_id": "uuid",
  "sources": ["document1.txt", "document2.txt"]
}
```

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration
│   ├── models/
│   │   └── chat.py          # Pydantic models
│   ├── services/
│   │   ├── rag_service.py   # RAG implementation
│   │   ├── mcp_service.py   # MCP protocol
│   │   └── llm_service.py   # LLM integration
│   └── api/
│       └── routes.py        # API routes
├── data/                    # Knowledge base documents
├── vectorstore/             # Vector database
├── requirements.txt
└── .env.example
```

## Development

The server runs with auto-reload enabled. Changes to Python files will automatically restart the server.

## Troubleshooting

- **Import errors**: Make sure you're in the `backend/` directory and virtual environment is activated
- **API key errors**: Verify your `.env` file has the correct API key
- **Vector store errors**: Delete `vectorstore/` directory to reinitialize
- **Port already in use**: Change `API_PORT` in `.env` or stop the process using port 8000
