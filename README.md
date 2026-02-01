# PedaGrowAI

An AI-powered educational assistant that combines Retrieval-Augmented Generation (RAG) with interactive chat and quiz features to enhance learning experiences.

## 🚀 Features

- **Intelligent Chat**: AI-powered conversations with educational content retrieval
- **Interactive Quizzes**: Dynamic quiz generation based on subjects and difficulty levels
- **RAG System**: Document retrieval using vector embeddings for context-aware responses
- **MCP Integration**: Model Context Protocol for structured context management
- **Multi-Provider LLM Support**: OpenAI and Anthropic API integration
- **Modern Web Interface**: Responsive React frontend with TypeScript
- **FastAPI Backend**: High-performance Python API with automatic documentation

## 🛠️ Tech Stack

### Backend
- **Python 3.8+**
- **FastAPI** - Modern web framework
- **ChromaDB** - Vector database for embeddings
- **LangChain** - LLM framework integration
- **OpenAI/Anthropic APIs** - LLM providers

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **Shadcn/ui** - Modern UI components
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

## 📋 Prerequisites

- Python 3.8 or higher
- Node.js 16+ and npm
- OpenAI API key (or Anthropic API key)

## 🏁 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd PedaGrowAI
```

### 2. Backend Setup

#### Windows:
```bash
cd backend
start.bat
```

#### Linux/Mac:
```bash
cd backend
chmod +x start.sh
./start.sh
```

#### Manual Setup (All Platforms):
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your API keys
python start.py OR ./start.bat
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 📁 Project Structure

```
PedaGrowAI/
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── models/         # Pydantic models
│   │   ├── services/       # Business logic (LLM, RAG, MCP)
│   │   └── config.py       # Configuration
│   ├── data/               # Knowledge base documents
│   ├── vectorstore/        # ChromaDB vector database
│   └── requirements.txt
├── frontend/                # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and API clients
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
# OR
GITHUB_API_KEY=your_github_api_key_here

# Optional
CORS_ORIGINS=http://localhost:8080,http://localhost:3000
```

## 📚 Usage

### Chat Feature
- Ask questions about educational topics
- The system retrieves relevant information from the knowledge base
- Get contextual, accurate responses powered by RAG

### Quiz Feature
- Select a subject and difficulty level
- Take interactive quizzes with multiple choice questions
- Get instant feedback and explanations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with FastAPI, React, and modern AI technologies
- Uses ChromaDB for vector storage
- Powered by OpenAI and Anthropic LLMs</content>
